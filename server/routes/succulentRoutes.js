
import express from "express"
import { getAllSucculents , createSucculent, createComment, addOrRemoveLike, deleteSucculent, deleteComment, updateSucculent, getAllComments ,getPlantCare } from "../controllers/succulentController.js"
import { multerUpload } from "../middlewares/multer.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const succulentRouter = express.Router();

succulentRouter.get("/all", getAllSucculents)
succulentRouter.get("/allcomments/:succulentId", jwtAuth, getAllComments);
succulentRouter.get("/plantCare/:speciesName", jwtAuth, getPlantCare);


succulentRouter.post("/new", multerUpload.single("img"),jwtAuth, createSucculent);
succulentRouter.post("/comments/:succulentId", jwtAuth, createComment);



succulentRouter.put("/likes/:succulentId",jwtAuth, addOrRemoveLike);
succulentRouter.put("/update/:succulentId", multerUpload.single("img"), jwtAuth, updateSucculent);


succulentRouter.delete("/delete/:succulentId", jwtAuth, deleteSucculent);
succulentRouter.delete("/delete/:succulentId/comments/:commentId", jwtAuth, deleteComment);






export default succulentRouter 