import { User } from "../models/userModels/user.model";

export const generateAccessAndRefreshCode = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();
    if (user)
      if (refreshToken) {
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
      }
    return { accessToken, refreshToken };
  } catch (error: any) {
    console.log(error.message);
    throw {
      status: 500,
      message: "something went wrong while generating tokens!!",
    };
  }
};
