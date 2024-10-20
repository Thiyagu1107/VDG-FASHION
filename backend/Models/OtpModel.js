import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    otp:{
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiry: {
        type: Date,
        required: true,
    },
})

export default mongoose.model('otp',otpSchema);