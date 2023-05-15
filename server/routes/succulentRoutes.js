
import express from "express"
import { getAllSucculents , createSucculent, createComment, addOrRemoveLike, deleteSucculent, deleteComment, updateSucculent } from "../controllers/succulentController.js"
import { multerUpload } from "../middlewares/multer.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const succulentRouter = express.Router();

succulentRouter.get("/all", getAllSucculents)


succulentRouter.post("/new", multerUpload.single("img"),jwtAuth, createSucculent);
succulentRouter.post("/comments/:succulentId",jwtAuth, createComment);
succulentRouter.post("/likes/:succulentId",jwtAuth, addOrRemoveLike);


succulentRouter.put("/update/:succulentId", multerUpload.single("img"), jwtAuth, updateSucculent);


succulentRouter.delete("/delete/:succulentId", jwtAuth, deleteSucculent);
succulentRouter.delete("/delete/:succulentId/comments/:commentId", jwtAuth, deleteComment);






export default succulentRouter 