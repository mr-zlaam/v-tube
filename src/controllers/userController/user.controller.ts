import type { Request, Response } from "express";
import { UserModelTypes } from "../../models/userModels/types.userModel";
import { User } from "../../models/userModels/user.model";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asynchandler";
import { uploadOnCloudinary } from "../../utils/cloudinary";
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
  const { email, password }: UserModelTypes = req.body;

  res.send("hello world");
});
export { RegisterUser, LoginUser };
