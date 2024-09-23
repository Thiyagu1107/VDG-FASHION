import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
  
    },
    address1:{
        type:String,
            
    },
    address2:{
        type:String,     
    },
    state:{
        type:String,     
    },
    city:{
        type:String,     
    },
    pincode:{
        type:Number,     
    },
    role:{
        type:Number,
        default:0,
    }
},
{
    timestamps:true,
})

export default mongoose.model('users',userSchema);