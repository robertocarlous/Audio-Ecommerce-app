const {Schema} = require("mongoose");
const mongoose = require("mongoose");
const categorySchema = new Schema (
    {
        name:{
            type:String,
            required:true,
        },
        subCategory:{
            type:String,
        },
    },
    {
        timestamps:true,
    }
);
module.exports = mongoose.model("category", categorySchema);