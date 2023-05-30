import SucculentModel from "../models/succulentModel.js";
import { imageUpload } from "../utils/imageMangement.js";
import UserModel from "../models/userModels.js";
import openAiConfig from "../config/openAiConfig.js";

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

/////////////////////////////////////////////////////////////////////////
const getAllComments = async (req, res) => {
  const userId = req.user._id;
  const { succulentId } = req.params;
  console.log("getAllcomments server----------", succulentId);
  try {
    const succulent = await SucculentModel.findById(succulentId);
    console.log("allComments ln 64 >>>", succulent);
    res.status(200).json({
      msg: `all comments from succulent :${succulentId}`,
      succulent,
    });
  } catch (error) {
    console.log("error showing all comments >>>>", error);
  }
};
//////////////////////////////////////////////////////////////
const createSucculent = async (req, res) => {
  const userId = req.user._id; // The jwtAuth middleware decoding the token from the Authorization-header request and attaching the user's info in the req.user object.
  
  if (!req.body.species || !req.body.description || !req.body.city) {
      return res.status(406).json({ error: "Please fill out all required fields" });
  }

  const img = await imageUpload(req.file, "succulents"); 
  // "succulents" represent the folder, it will create a folder if not exist already.

  const newSucculent = new SucculentModel({
      ...req.body,
      img: img,
      owner: userId, // Use the userId from the token
      likes: [], // Initialize the likes array as empty
      Comments:[]
  });

  try {
      const createdSucculent = await newSucculent.save();
      console.log(createdSucculent);

    // Find the user by the owner field and update their succulents array
      const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { $push: { succulents: createdSucculent._id } },
          { new: true, useFindAndModify: false }
      );

    

      console.log("User's succulents array updated successfully:", updatedUser.succulents);
      res.status(200).json({ msg: "Succulent successfully created!", newSucculent: createdSucculent });
  } catch(e) {
      console.log(e);
      res.status(500).json({ eroor: "Something went wrong while creating the succulent." });
  }
}


//////////////////////////////////////////////////////////////////////////////

const createComment = async (req, res) => {
  const userId = req.user._id; // The jwtAuth middleware decoding the token from the Authorization-header request and attaching the user's info in the req.user object.
  const { succulentId } = req.params; // Get the succulent ID from the request params

  try {
    // Validate comment text
    const commentText = req.body.text;
    if (!commentText ) {
      return res.status(400).json({ error: "Please fill out all required fields" });
    }
    
    // Find the succulent by its ID
    const succulent = await SucculentModel.findById(succulentId);

    if (!succulent) {
      return res.status(404).json({ error: "Succulent not found" });
    }

        // Find the user by its ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new comment
    const comment = {
      authorId: userId,
      authorName: user.username,
      authorImage: user.avatar, // assuming the user's profile image is stored in a field named avatar
      text: commentText
    };

    // Add the comment to the succulent's comments array
    succulent.Comments.push(comment);

    // Save the updated succulent and the new comment
    await succulent.save();

    res.status(200).json({ msg: "Successfully added comment", succulent });
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: "Something went wrong while adding a comment." });
  }
}


////////////////////////////////////////////////////////////////////////////////////

const addOrRemoveLike = async (req, res) => {
  const userId = req.user._id; // The jwtAuth middleware decoding the token from the Authorization-header request and attaching the user's info in the req.user object.
  const { succulentId } = req.params; // Get the succulent ID from the request params

  try {
    // Find the succulent by its ID
    const succulent = await SucculentModel.findById(succulentId);

    if (!succulent) {
      return res.status(404).json({ error: "Succulent not found" });
    }

    // Check if the user's ID exists in the likes array
    const index = succulent.likes.indexOf(userId);
    let message = "";
    if (index === -1) {
      // If the user's ID doesn't exist in the likes array, add it
      succulent.likes.push(userId);
      message = "Successfully added like";
    } else {
      // If the user's ID exists in the likes array, remove it
      succulent.likes.splice(index, 1);
      message = "Successfully removed like";
    }

    // Save the updated succulent
    await succulent.save();

    res.status(200).json({ msg: message, succulent });
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: "Something went wrong while updating likes." });
  }
}

////////////////////////////////////////////////////////////////////////////////////////

const deleteSucculent = async (req, res) => {
  const userId = req.user._id; // Get the user's ID from the request.
  const { succulentId } = req.params; // Get the succulent ID from the request params

  try {
    let succulent; //  Declaring it outside so I'll be able to use it again in this func outside this try&catch block.
    try {
      // Attempt to find the succulent by its ID
      succulent = await SucculentModel.findById(succulentId);
    } catch (error) {
      // Handle the error if the succulent is not found
      return res.status(404).json({ error: "Succulent not found" });
    }

    // Check if the user is the owner of the succulent or the user is an admin
    if (succulent.owner.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Keep your fingers to yourself!"});
    }

    // Delete the succulent
    await SucculentModel.findByIdAndRemove(succulentId);

    // Remove the succulent from the user's succulents array
    await UserModel.updateOne(
      { _id: succulent.owner },
      { $pull: { succulents: succulentId } }
    );

    res.status(200).json({ msg: "Succulent successfully deleted!" });
  } catch(e) {
    console.log(e);
    res.status(500).json({ msg: "Something went wrong while deleting the succulent." });
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////

const deleteComment = async (req, res) => {
  try {
    const { succulentId, commentId } = req.params;
    const userId = req.user._id;

    const succulent = await SucculentModel.findById(succulentId);

    if (!succulent) {
      return res.status(404).json({ error: "Succulent not found" });
    }

    const comment = succulent.Comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.authorId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Keep your fingers to yourself!" });
    }

    // Remove the comment from the Comments array
    succulent.Comments.pull(commentId);

    await succulent.save();

    res.status(200).json({ msg: "Comment successfully deleted!" ,succulent });
  } catch(e) {
    res.status(500).json({ msg: "Something went wrong while deleting the comment." });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////

const updateSucculent = async (req, res) => {
  try {
    // Get the succulent ID from the request params
    const succulentIdToUpdate = req.params.succulentId;

    let updatedData = { ...req.body };

    // Fetch the succulent data
    const succulent = await SucculentModel.findById(succulentIdToUpdate);

    // If succulent not found, return error
    if (!succulent) {
      return res.status(404).json({ error: "Succulent not found" });
    }

    // Check if the user is the owner of the succulent or an admin
    if (succulent.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Keep your fingers to yourself!" });
    }

    // Check if there's a new image and upload it
    if (req.file) {
      updatedData.img = await imageUpload(req.file, "succulents"); // Assuming "succulents" is the folder where you store succulent images
    }

    // Update the succulent with the new data
    const updatedSucculent = await SucculentModel.findByIdAndUpdate(succulentIdToUpdate, updatedData, { new: true });

    // Return updated succulent
    res.status(200).json({ msg: "Succulent successfully updated!",updatedSucculent});
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something went wrong with updating the succulent." });
  }
};
/////////////////////////////////////////////////////////////////////////////////

const getPlantCare = async (req, res) => {
  try {
    const { speciesName } = req.params;
    const data = await openAiConfig(speciesName); // Pass the speciesName to the openAiConfig function
    res.status(200).json({ "response from OpenAI": data });
  } catch (error) {
    console.log(error.message);
    console.log
    res.status(500).json({ "something went wrong with getPlantCare backend": error });
  }
};


export { getAllSucculents, createSucculent, createComment, addOrRemoveLike, deleteSucculent, deleteComment ,updateSucculent, getAllComments, getPlantCare} 
