import express, { Router } from "express";
import { registerController, loginController } from "../controllers/auth/controller";

const authRouter: Router = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);

export default authRouter;
