import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
},
    {
        timestamps:true,
    }
);

export default mongoose.model('subcategory', subcategorySchema);
