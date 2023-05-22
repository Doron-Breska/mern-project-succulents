import express from "express"

import { getUsers, getUserById, createUser, updateUser, login, getActiveUser } from "../controllers/userControllers.js";

import jwtAuth from "../middlewares/jwtAuth.js";

import { multerUpload } from "../middlewares/multer.js";


const userRouter = express.Router();


userRouter.get("/all", getUsers)
userRouter.get("/id/:id", getUserById);
userRouter.get("/active", jwtAuth, getActiveUser);



userRouter.post("/new", multerUpload.single("avatar"), createUser);
userRouter.post("/login", login);


userRouter.put("/update/:id", multerUpload.single("avatar"), jwtAuth, updateUser);




export default userRouter 