import { Router } from "express";
import { RegisterUser } from "../../controllers/userController/user.controller";
const userRouter = Router();
userRouter.route("/register").post(RegisterUser);

export default userRouter;
