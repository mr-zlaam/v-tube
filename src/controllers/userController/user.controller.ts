import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asynchandler";
import { UserModelTypes } from "../../models/userModels/types.userModel";
import { upload } from "../../middlewares/multer.middleware";
import { User } from "../../models/userModels/user.model";
import { uploadOnCloudinary } from "../../utils/cloudinary";
const RegisterUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
    const coverImageLocalPath: string = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
      throw { status: 400, message: "avatar file is required!!" };
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) throw { status: 400, message: "avatarfile is required!!" };
    const user = await User.create({
      username: username.toLowerCase(),
      fullName,
      avatar: avatar.url,
      coverImage: coverImage ? coverImage.url : "",
      email: email.toLowerCase(),
      password,
    });
    const isUserCreated = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!isUserCreated)
      throw { status: 500, message: "unable to create user!!" };
    res.send("Hello world");
  }
);
export { RegisterUser };
