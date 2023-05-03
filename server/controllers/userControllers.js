import UserModel from "../models/userModels.js";
import { imageUpload } from "../utils/imageMangement.js";
import { verifyPassword, encryptPassword } from "../utils/bcrypt.js";

const testingRoute = (req, res) => {
    res.send('testing 1')
}

const getUsers = async (req, res) => {
     try {
    const users = await UserModel.find();
    res.status(200).json(users);
     } catch (e) {
       res.status(500).json({error:"something went wrong.."})
    console.log(e);
  }
}

const getUserById = async(req, res) => {
    const params = req.params;
    console.log(params); // should show {id: blahblah}
    const id = req.params.id;
    console.log(id); //should show just "blahblah"
 try {
     const user = await UserModel.findById(id).populate("succulents");
     res.status(200).json(user)
 } catch (error) {
     console.log(error);
     res.status(500).json({error:"something went wrong..."})
 }
}

const createUser = async (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.username) {
    return res.status(406).json({ error: "Please fill out all fields" })
  }
  const avatar = await imageUpload(req.file, "avatars"); 
  // "avatars" represent the folder, it will create a folder if not exsist already.
  const encryptedPassword = await encryptPassword(req.body.password);
    console.log(req.body)
  const newUser = new UserModel({
    ...req.body,
    password: encryptedPassword,
    succulents: [],
      avatar: avatar
  }) 
  try {
    const registeredUser = await newUser.save();
    console.log(registeredUser);
    // res.status(200).json({ msg: "successfully registered!", newUser: registeredUser });
    res.status(200).json({msg: "successfully registered!"});
  } catch(e) {
    console.log(e);
    res.status(500).json({msg:"something went wrong with you registration"});
  }
}

const updateUser = async (req, res) => {
  try {
  const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedUser);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message)
  }
}

const login = async(req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (!existingUser) {
      res.status(404).json({error: "no user found"})
      return;
    }
    if (existingUser) {
      const verified = await verifyPassword(req.body.password, existingUser.password); //comparing the password the user entered to the password connected to the user that found in the prev stage
      if (!verified) {
        res.status(406).json({ error: "password doesn't match" })
      }
      if (verified) {
        res.status(200).json({
          verified: true,
          user: {
            _id: existingUser._id,
            username: existingUser.username,
            succulents: existingUser.succulents,
            avatar: existingUser.avatar
          }
        })
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "something went wrong.." })
  }
}



export { testingRoute, getUsers, getUserById ,createUser, updateUser, login }