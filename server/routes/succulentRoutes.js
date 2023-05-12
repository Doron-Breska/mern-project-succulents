
import express from "express"
import { getAllSucculents , createSucculent, createComment} from "../controllers/succulentController.js"
import { multerUpload } from "../middlewares/multer.js";

const succulentRouter = express.Router();

succulentRouter.get("/all", getAllSucculents)




succulentRouter.post("/new", multerUpload.single("img"), createSucculent);
succulentRouter.post("/comments/:succulentId", createComment);






export default succulentRouter 