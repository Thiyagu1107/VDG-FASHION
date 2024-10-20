import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    saleprice:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
    },
    category:{
        type:mongoose.ObjectId,
        ref:'category',
        required:true,
    },
    subcategory:{
        type:mongoose.ObjectId,
        ref:'subcategory',
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    imageUrl:{
        type:String
    },
    shipping:{
        type:Boolean,
    },
    isactive:{
        type:Boolean,
        default:true,
    }
},
    {
        timestamps:true,
})

export default mongoose.model('products',productSchema);