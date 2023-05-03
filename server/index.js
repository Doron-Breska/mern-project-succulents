import express from "express";
import mongoose from 'mongoose';
import cloudinaryConfig from "./config/cloudinary.js";
import userRouter from './routes/userRoutes.js'
import succulentRouter from "./routes/succulentRoutes.js";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";



const app = express();
const port = process.env.PORT || 5001;

const setMiddlewares = () => {
  app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
cloudinaryConfig()
}

const connectMongoose = () => {
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log("Connection to MongoDB established, and server is running on port " + port);
    });
  })
  .catch((err) => console.log(err));
}
 
const connectRoutes = () => {
  app.use('/api/users', userRouter);
app.use('/api/succulents', succulentRouter)
}


setMiddlewares();
connectMongoose();
connectRoutes(); 


  

