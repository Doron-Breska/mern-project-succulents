import SucculentModel from "../models/succulentModel.js";
import { imageUpload } from "../utils/imageMangement.js";
import UserModel from "../models/userModels.js";

////////////////////////////////////////////////////////////////
const getAllSucculents = async (req, res) => {
       try {
    // const succulent = await SucculentModel.find().populate("owner"); --- this will get the whole user object inc password etc.  
       const succulent = await SucculentModel.find().populate({path :"owner", select :["username", "email", "avatar"]});    
    res.status(200).json(succulent);
     } catch (e) {
       res.status(500).json({error:"something went wrong.."})
    console.log(e);
  }
}
//////////////////////////////////////////////////////////////
const createSucculent = async (req, res) => {
    if (!req.body.species || !req.body.description || !req.body.city || !req.body.owner) {
        return res.status(406).json({ error: "Please fill out all required fields" });
    }

    const img = await imageUpload(req.file, "succulents"); 
    // "succulents" represent the folder, it will create a folder if not exist already.

    const newSucculent = new SucculentModel({
        ...req.body,
        img: img,
        likes: [] // Initialize the likes array as empty
    });

    try {
        const createdSucculent = await newSucculent.save();
        console.log(createdSucculent);

      // Find the user by the owner field and update their succulents array
        const updatedUser = await UserModel.findByIdAndUpdate(
            createdSucculent.owner,
            { $push: { succulents: createdSucculent._id } },
            { new: true, useFindAndModify: false }
        );

      

        console.log("User's succulents array updated successfully:", updatedUser.succulents);
        res.status(200).json({ msg: "Succulent successfully created!", newSucculent: createdSucculent });
    } catch(e) {
        console.log(e);
        res.status(500).json({ msg: "Something went wrong while creating the succulent." });
    }
}

//////////////////////////////////////////////////////////////////////////////

const createComment = async (req, res) => {
    console.log(req.params);  // Log the params
    console.log(req.body);   // Log the request body
    const { succulentId } = req.params; // Getting succulentId from request parameters
    const { author, authorImage, text } = req.body;  // Corrected the field name

    // Check if all required fields are provided
    if (!author || !authorImage || !text ) {
        return res.status(400).json({ error: "Please provide all required comment fields" });
    }

    try {
        // Find the succulent by id
        const succulent = await SucculentModel.findById(succulentId);

        if (!succulent) {
            return res.status(404).json({ error: "Succulent not found" });
        }

        // Create the comment and add it to the succulent's Comments array
        const comment = { author, authorImage, text};
        succulent.Comments.push(comment);

        // Save the updated succulent
        await succulent.save();

        res.status(200).json({ msg: "Comment successfully added!", comment });
    } catch(e) {
        console.log(e);
        res.status(500).json({ msg: "Something went wrong while adding the comment." });
    }
}

////////////////////////////////////////////////////////////////////////////////////

const addOrRemoveLike = async (req, res) => {
  const userId = req.user._id; // Get the user's ID from the request. This assumes that you're setting the user in the request (e.g., from a middleware)
  const { succulentId } = req.params; // Get the succulent ID from the request params

  try {
    // Find the succulent by its ID
    const succulent = await SucculentModel.findById(succulentId);

    if (!succulent) {
      return res.status(404).json({ error: "Succulent not found" });
    }

    // Check if the user's ID exists in the likes array
    const index = succulent.likes.indexOf(userId);
    if (index === -1) {
      // If the user's ID doesn't exist in the likes array, add it
      succulent.likes.push(userId);
    } else {
      // If the user's ID exists in the likes array, remove it
      succulent.likes.splice(index, 1);
    }

    // Save the updated succulent
    await succulent.save();

    res.status(200).json({ msg: "Successfully updated likes", succulent });
  } catch(e) {
    console.log(e);
    res.status(500).json({ msg: "Something went wrong while updating likes." });
  }
}



export { getAllSucculents, createSucculent, createComment, addOrRemoveLike } 
