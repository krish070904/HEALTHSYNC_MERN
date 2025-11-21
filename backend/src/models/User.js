import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  diseaseTags: {
    type: [String],
    default: []
  },
  dietType:{
    type: String,
    required: true
  },
  profileImage: { 
    type: String 
  },
  fcmToken: {
    type: String,
    default: null
  }

}, { timestamps: true });



export default mongoose.model("User", UserSchema);

