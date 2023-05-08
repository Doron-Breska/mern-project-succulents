import express from "express"

import { testingRoute, getUsers, getUserById, createUser, updateUser, login, getActiveUser } from "../controllers/userControllers.js";

import jwtAuth from "../middlewares/jwtAuth.js";

import { multerUpload } from "../middlewares/multer.js";


const userRouter = express.Router();

userRouter.get("/test", testingRoute)
userRouter.get("/all", getUsers)
userRouter.get("/id/:id", getUserById);
userRouter.get("/active",jwtAuth, getActiveUser);

userRouter.post("/new", multerUpload.single("avatar"), createUser);
userRouter.post("/update/:id", updateUser);
userRouter.post("/login", login);





export default userRouter 