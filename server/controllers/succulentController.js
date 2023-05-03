import SucculentModel from "../models/succulentModel.js";

const getAllSucculents = async (req, res) => {
       try {
    // const succulent = await SucculentModel.find().populate("owner"); --- this will get the whole user object inc password etc.  
       const succulent = await SucculentModel.find().populate({path :"owner", select :["username", "email"]});    
    res.status(200).json(succulent);
     } catch (e) {
       res.status(500).json({error:"something went wrong.."})
    console.log(e);
  }
}

export { getAllSucculents } 