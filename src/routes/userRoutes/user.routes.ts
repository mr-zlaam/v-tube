import { Router } from "express";
import { RegisterUser } from "../../controllers/userController/user.controller";
import { upload } from "../../middlewares/multer.middleware";
const userRouter = Router();
userRouter.route("/register").post(
  //middleware,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  RegisterUser
);

export default userRouter;
