const {Schema} = require("mongoose");
const mongoose = require("mongoose");
const ProductSchema = new Schema(
    {
        name:{
            type:String, 
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        quantitySold:{
            type:Number,
            required:true,
            default:0,
        },
        category:{
            type:Schema.Types.ObjectId,
            ref:"Category",
            required:true,
        },
    },
    {
        timestamps:true,
    }
) 

module.exports = mongoose.model("Product", ProductSchema);