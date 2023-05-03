import express from "express"
import { getAllSucculents } from "../controllers/succulentController.js"

const succulentRouter = express.Router();

succulentRouter.get("/all", getAllSucculents)


export default succulentRouter 