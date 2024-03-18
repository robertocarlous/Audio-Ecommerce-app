const {Schema} = require ("mongoose");
const mongoose = require("mongoose");
const UserSchema = new Schema(
    {
        name:{
            type:String, 
            required:String,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String, 
            required:true,
        },

        resetPasswordToken: {
            type: String, 
          },
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model("User", UserSchema);


