import type { Request, Response } from "express";
import { UserModelTypes } from "../../models/userModels/types.userModel";
import { User } from "../../models/userModels/user.model";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asynchandler";
import { uploadOnCloudinary } from "../../utils/cloudinary";
import { generateAccessAndRefreshCode } from "../../utils/generateTokens";
import { ISDEVELOPMENT_ENVIRONMENT } from "../../config";
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
  if (!username || !email)
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
  const cookieOptions = {
    httpOnly: true,
    secure: !ISDEVELOPMENT_ENVIRONMENT && true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refresToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        `${user.username || "user"} logged in successfully.`
      )
    );
});

//Logout functionality
const LogoutUser = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
});

export { RegisterUser, LoginUser };
