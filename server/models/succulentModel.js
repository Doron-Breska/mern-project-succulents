import mongoose from 'mongoose';
const { Schema } = mongoose;


const commentSchema = new Schema({
    author: { type: String, required: true, },
    authorImage: { type: String, required: true, },  // Corrected the field name
    text: { type: String, required: true, },
    commentTime: {type: Date }
}, { timestamps: true });

//  commentTime: {type: Date, required: true }

const succulentSchema = new mongoose.Schema({
    species: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "user"}, // ref reffer to the relevant collection in mongo db
    img: { type: String , required:true},
    description: { type: String, required: true },
    city: { type: String, required: true },
    likes: [{ type: String }], //here i want to have an array of users id's
    Comments: [commentSchema]

}, { timestamps: true })

const SucculentModel = mongoose.model("succulent", succulentSchema)

export default SucculentModel