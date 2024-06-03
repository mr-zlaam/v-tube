import type { Request, Response } from "express";
import { UserModelTypes } from "../../models/userModels/types.userModel";
import { User } from "../../models/userModels/user.model";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asynchandler";
import { uploadOnCloudinary } from "../../utils/cloudinary";
import { generateAccessAndRefreshCode } from "../../utils/generateTokens";
import { ISDEVELOPMENT_ENVIRONMENT, JWT_REFRESH_SECRET } from "../../config";
import { AuthRequest, decodedRefreshTokenType } from "../../types";
import jwt from "jsonwebtoken";
import { COOKIES_OPTION } from "../../CONSTANTS";
import { DeleteImageFromLocalServer } from "../../utils/ImageDelete";
const RegisterUser = asyncHandler(async (req: Request, res: Response) => {
  //multer files
  req.files = req.files as { [fieldname: string]: Express.Multer.File[] };
  ///
  //get user from frontend.
  const { email, username, fullName, password }: UserModelTypes = req.body;
  if (!email || !username || !fullName! || !password) {
    throw { status: 400, message: "All fields are required!!" };
  }
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser)
    throw {
      status: 409,
      message: "user already exist with same mail or username!!",
    };
  //avatar getting
  const avatarLocalPath: string = req.files?.avatar[0].path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0]?.path;
  }

  if (!avatarLocalPath) {
    throw { status: 400, message: "avatar file is required!!" };
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath!);
  if (!avatar) throw { status: 400, message: "avatarfile is required!!" };

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    avatar: avatar.url,
    coverImage: (coverImage !== undefined && coverImage?.url) || "",
    email: email.toLowerCase(),
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser)
    throw { status: 500, message: "unable to create user for some reason!!" };
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "user registered  successfully"));
});
const LoginUser = asyncHandler(async (req: Request, res: Response) => {
  /*
  # Algo for sing in
  *1 Get data from req.body
  *2 check if user exist
  *3 if user exist check if password is correct
  *4 if password is correct generate token
  *5 if token is generated send token to client through secure cookies.

  */

  const { username, email, password }: UserModelTypes = req.body;
  if (!username && !email)
    throw { status: 400, message: "username or email is required!!" };
  if (!password) throw { status: 400, message: "password is required!!" };
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) throw { status: 404, message: "user doesn't exist!!" };
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw { status: 401, message: "Invalid credentials!!" };
  //generate token
  const { accessToken, refreshToken } = await generateAccessAndRefreshCode(
    user?._id as string
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refresToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, COOKIES_OPTION)
    .cookie("refresToken", refreshToken, COOKIES_OPTION)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        `${user.username || "user"} logged in successfully.`
      )
    );
});

//Logout functionality
const LogoutUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userID = req.user?._id;
  await User.findByIdAndUpdate(
    userID,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", COOKIES_OPTION)
    .clearCookie("refreshToken", COOKIES_OPTION)
    .json(new ApiResponse(200, {}, "user logged out successfully!!"));
});

const RefreshaccessToken = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshtoken;
    if (!incomingRefreshToken)
      throw {
        status: 401,
        message: "Unauthorized request while getting incoming refresToken!!",
      };
    let decodedRefreshToken;
    try {
      decodedRefreshToken = jwt.verify(
        incomingRefreshToken,
        JWT_REFRESH_SECRET
      ) as decodedRefreshTokenType;
    } catch (error: any) {
      console.error(error.message);
      throw {
        status: error.status || 401,
        message:
          error.message ||
          "some thing went wrong while verifying refreshToken.",
      };
    }
    const userID = decodedRefreshToken?._id;
    const user = await User.findById(userID);
    if (!user) {
      throw { status: 401, message: "invalid refresh token" };
    }
    if (user?.refreshToken !== incomingRefreshToken)
      throw { status: 401, message: "invalid refresh expired or used!!" };
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshCode(user?._id as string);
    return res
      .status(200)
      .cookie("accessToken", accessToken, COOKIES_OPTION)
      .cookie("refreshToken", newRefreshToken, COOKIES_OPTION)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed."
        )
      );
    //LAST LINE
  }
);
const ChangeCurrentPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;
    const user = await User.findById(userId);
    const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect)
      throw { status: 400, message: "invalid old password!!" };
    if (user) user.password = newPassword;
    await user?.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully."));
  }
);
const GetCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) throw { status: 404, message: "user not found" };
  return res
    .status(200)
    .json(new ApiResponse(200, currentUser, "user Fetched successfullly"));
});
const UpdateAccountDetails = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { fullName, email }: UserModelTypes = req.body;
    if (!fullName || !email) {
      throw { status: 401, message: "All fields are required!!" };
    }
    const userId = req?.user?._id;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: { fullName, email },
      },
      { new: true }
    ).select("-password");
    return res
      .status(201)
      .json(
        new ApiResponse(201, user, "Account information updated successfully.")
      );
  }
);
const UpdateAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw { status: 401, message: "Avatar Image is required!!" };
  }
  const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
  if (!uploadedAvatar?.url) {
    throw { status: 500, message: "Error while updating avatart file" };
  }
  if (uploadedAvatar?.url) {
    DeleteImageFromLocalServer(avatarLocalPath);
    const userId = req.user?._id;
    let user;
    if (userId) {
      user = await User.findByIdAndUpdate(
        userId,
        { $set: { avatar: uploadedAvatar.url } },
        { new: true }
      ).select("-password");
    } else {
      throw {
        status: 500,
        message: "something went wrong while updating avatar Image",
      };
    }
    return res
      .status(201)
      .json(
        new ApiResponse(201, { user }, "avatar Image updated successfully.")
      );
  }
});
const UpdateCoverImage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
      throw { status: 401, message: "Avatar Image is required!!" };
    }
    const uploadedCoverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!uploadedCoverImage?.url) {
      throw { status: 500, message: "Error while updating avatart file" };
    }
    if (uploadedCoverImage?.url) {
      DeleteImageFromLocalServer(coverImageLocalPath);
      const userId = req.user?._id;
      let user;
      if (userId) {
        user = await User.findByIdAndUpdate(
          userId,
          { $set: { coverImage: uploadedCoverImage.url } },
          { new: true }
        ).select("-password");
      } else {
        throw {
          status: 500,
          message: "something went wrong while updating cover Image",
        };
      }
      return res
        .status(201)
        .json(
          new ApiResponse(201, { user }, "cover Image updated successfully.")
        );
    }
  }
);
const GetUserChannelProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { username } = req.params;
    if (!username?.trim())
      throw { status: 400, message: "username is required" };
    const channel = await User.aggregate([
      {
        $match: {
          username: username?.toLowerCase(),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribeTo",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
          },
          channelsSubscribeToCount: {
            $size: "$subscribeTo",
          },
          isSubscribed: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          subscribersCount: 1,
          channelsSubscribeToCount: 1,
          isSubscribed: 1,
          avatar: 1,
          email: 1,
          coverImage: 1,
        },
      },
    ]);
    console.log("Channel returning the value:::", channel);
    if (!channel?.length) throw { status: 404, message: "Channel not found" };
    return res
      .status(200)
      .json(
        new ApiResponse(200, channel[0], "User channe fetched successfully.")
      );
  }
);
export {
  RegisterUser,
  LoginUser,
  LogoutUser,
  RefreshaccessToken,
  ChangeCurrentPassword,
  GetCurrentUser,
  UpdateAccountDetails,
  UpdateAvatar,
  UpdateCoverImage,
  GetUserChannelProfile,
};
