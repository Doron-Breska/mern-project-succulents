import mongoose from 'mongoose';

const succulentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // ref reffer to the relevant collection in mongo db
    img: {type: String }
}, { timestamps: true })

const SucculentModel = mongoose.model("succulent", succulentSchema)

export default SucculentModel