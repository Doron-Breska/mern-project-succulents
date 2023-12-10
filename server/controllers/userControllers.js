import UserModel from "../models/userModels.js";
import { imageUpload } from "../utils/imageMangement.js";
import { verifyPassword, encryptPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find().populate("succulents");
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: "something went wrong.." });
    console.log(e);
  }
};

const getUserById = async (req, res) => {
  const params = req.params;
  // console.log(params); // should show {id: blahblah}
  const id = req.params.id;
  // console.log(id); //should show just "blahblah"
  try {
    const user = await UserModel.findById(id).populate("succulents");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong..." });
  }
};

const createUser = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res.status(406).json({ error: "Please fill out all fields" });
  }

  const avatar = await imageUpload(req.file, "avatars");
  const encryptedPassword = await encryptPassword(req.body.password);

  const newUser = new UserModel({
    ...req.body,
    password: encryptedPassword,
    succulents: [],
    avatar: avatar,
  });

  try {
    const registeredUser = await newUser.save();
    res.status(200).json({
      msg: "Successfully registered!",
    });
  } catch (e) {
    console.log(e);
    if (e.code === 11000) {
      let field = e.keyValue;
      let errorField = Object.keys(field)[0]; // getting the field that caused the error
      res.status(409).json({
        error: `The ${errorField} '${field[errorField]}' is already in use, please try something different`,
      });
    } else {
      res
        .status(500)
        .json({ error: "Something went wrong with your registration" });
    }
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    // Get the user ID to be updated from the request params
    const userIdToUpdate = req.params.id;

    // Check if the user is updating their own profile or they're an admin
    if (
      req.user._id.toString() !== userIdToUpdate &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Keep your fingers to yourself!" });
    }

    // Fetch current user data
    const currentUser = await UserModel.findById(userIdToUpdate);

    // Check if there's a new password and encrypt it
    if (req.body.password && req.body.password !== currentUser.password) {
      updatedData.password = await updatePassword(req.body.password);
    }

    // Check if there's a new avatar and upload it
    if (req.file && req.file !== currentUser.avatar) {
      updatedData.avatar = await updateAvatar(req.file);
    }

    // Check if username and email are being updated to a new value
    if (req.body.username && req.body.username !== currentUser.username) {
      const userWithSameUsername = await UserModel.findOne({
        username: req.body.username,
      });
      if (userWithSameUsername) {
        return res.status(409).json({
          error: `The username '${req.body.username}' is already in use, please try something different`,
        });
      }
    }

    if (req.body.email && req.body.email !== currentUser.email) {
      const userWithSameEmail = await UserModel.findOne({
        email: req.body.email,
      });
      if (userWithSameEmail) {
        return res.status(409).json({
          error: `The email '${req.body.email}' is already in use, please try something different`,
        });
      }
    }

    // Check for udates
    let isChanged = false;
    for (let key in updatedData) {
      if (currentUser[key] !== updatedData[key]) {
        isChanged = true;
        break;
      }
    }

    if (!isChanged) {
      return res
        .status(200)
        .json({ message: "You didn't change any of the values...." });
    }

    // Update the user with the new data
    const updatedUser = await UserModel.findByIdAndUpdate(
      userIdToUpdate,
      updatedData,
      { new: true, runValidators: true }
    ); // "runValidators: true" to ensure the update respect the "unique" in the user schema.

    res.status(200).json(updatedUser);
  } catch (e) {
    console.log(e);
    if (e.code === 11000) {
      let field = e.keyValue;
      let errorField = Object.keys(field)[0]; // getting the field that caused the error
      res.status(409).json({
        error: `The ${errorField} '${field[errorField]}' is already in use, please try something different`,
      });
    } else {
      res
        .status(500)
        .json({ error: "Something went wrong with updating your profile.." });
    }
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const login = async(req, res) => {
//   try {
//     const existingUser = await UserModel.findOne({ email: req.body.email });
//     if (!existingUser) {
//       res.status(404).json({error: "no user found"})
//       return;
//     }
//     if (existingUser) {
//       const verified = await verifyPassword(req.body.password, existingUser.password); //comparing the password the user entered to the password connected to the user that found in the prev stage
//       if (!verified) {
//         res.status(406).json({ error: "password doesn't match" })
//       }
//       if (verified) {
//         const token = generateToken(existingUser)
//         res.status(200).json({
//           verified: true,
//           token:token,
//           user: {
//             _id: existingUser._id,
//             username: existingUser.username,
//             succulents: existingUser.succulents,
//             avatar: existingUser.avatar,
//             role: existingUser.role
//           }
//         })
//       }
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ error: "something went wrong with loggin you in.." })
//   }
// }

const login = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (!existingUser) {
      return res.status(404).json({ error: "no user found" });
    }

    const verified = await verifyPassword(
      req.body.password,
      existingUser.password
    );

    if (!verified) {
      return res.status(406).json({ error: "password doesn't match" });
    }

    const token = generateToken(existingUser);

    res.status(200).json({
      verified: true,
      token: token,
      user: {
        _id: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
        avatar: existingUser.avatar,
        succulents: existingUser.succulents,
        role: existingUser.role,
      },
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ error: "something went wrong with logging you in.." });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////
const getActiveUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate("succulents");
    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      succulents: user.succulents,
      role: user.role,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "something went wrong.." });
  }
};

export { getUsers, getUserById, createUser, updateUser, login, getActiveUser };
