import express from "express";
import mongoose from 'mongoose';
import cloudinaryConfig from "./config/cloudinary.js";
import userRouter from './routes/userRoutes.js'
import succulentRouter from "./routes/succulentRoutes.js";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { passportConfig } from "./config/passport.js";



const app = express();

const port = process.env.PORT || 5001;
const startServer = () => {
  

  app.listen(port, () => {
    console.log("Server is running in port ", port);
  });
};



// const allowedOrigins = ["http://localhost:5001","https://mern-project-succulents-client.vercel.app"]

// const corsOptions = {
//     origin: function (origin, callback) {
//       if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//   };



const setMiddlewares = () => {
  app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// app.use(cors(corsOptions));
app.use(cors()); // this will allow requests from any origin
  cloudinaryConfig();
  passportConfig();
}



const connectMongoose = () => {
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connection to MongoDB established, and server is running on port " + port))
  
  .catch((err) => console.log(err))
}
 
const connectRoutes = () => {
  app.use('/api/users', userRouter);
  app.use('/api/succulents', succulentRouter)
}

(async function controller() {
  setMiddlewares();
  await connectMongoose();
  connectRoutes(); 
  startServer()

})()

  

