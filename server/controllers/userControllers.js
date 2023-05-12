
import UserModel from "../models/userModels.js";
import { imageUpload } from "../utils/imageMangement.js";
import { verifyPassword, encryptPassword } from "../utils/bcrypt.js";

import { generateToken } from "../utils/jwt.js";




const getUsers = async (req, res) => {
     try {
    const users = await UserModel.find().populate("succulents");
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


const updatePassword = async (password) => {
  const encryptedPassword = await encryptPassword(password);
  return encryptedPassword;
};

const updateAvatar = async (file) => {
  const avatar = await imageUpload(file, "avatars");
  return avatar;
};

const updateUser = async (req, res) => {
  try {
    let updatedData = { ...req.body };

    // Check if there's a new password and encrypt it
    if (req.body.password) {
      updatedData.password = await updatePassword(req.body.password);
    }

    // Check if there's a new avatar and upload it
    if (req.file) {
      updatedData.avatar = await updateAvatar(req.file);
    }

    // Update the user with the new data
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json(updatedUser);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};


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
        const token = generateToken(existingUser)
        res.status(200).json({
          verified: true,
          token:token,
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

const getActiveUser = (req, res) => {
  // res.send(req.user)   this will send the whole user object to the front
    res.status(200).json({
    _id: req.user._id,
    email: req.user.email,
    username: req.user.username,
    avatar: req.user.avatar,
  });
}



export { getUsers, getUserById, createUser, updateUser, login, getActiveUser }
