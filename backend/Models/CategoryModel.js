import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String
    }
},
    {
        timestamps:true,
    }
);

export default mongoose.model('category', categorySchema);
