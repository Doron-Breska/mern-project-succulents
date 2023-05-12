import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true , unique :true},
    password: { type: String, required: true },
    username: {type: String, required: true, unique :true } ,
    succulents: [{ type: mongoose.Schema.Types.ObjectId, ref: "succulent" }], // ref reffer to the relevant collection in mongo db
    avatar: { type: String, default: "https://res.cloudinary.com/danq3q4qv/image/upload/v1683035195/avatars/default-profile-picture-avatar-photo-placeholder-vector-illustration-700-205664584_z4jvlo.jpg" },
    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
}
}, { timestamps: true })

const UserModel = mongoose.model("user", userSchema)

export default UserModel
