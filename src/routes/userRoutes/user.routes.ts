import { Router } from "express";
import {
  LoginUser,
  LogoutUser,
  RefreshaccessToken,
  RegisterUser,
} from "../../controllers/userController/user.controller";
import { upload } from "../../middlewares/multer.middleware";
import { verifyJwt } from "../../middlewares/auth.middleware";
const userRouter = Router();
userRouter.route("/register").post(
  //middleware,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  RegisterUser
);
userRouter.route("/login").post(LoginUser);
//secured routes
userRouter.route("/logout").post(verifyJwt, LogoutUser);
userRouter.route("/refreshAccessToken").post(RefreshaccessToken);
export default userRouter;
