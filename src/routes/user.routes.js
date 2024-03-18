const {Router} = require("express");
const{registerUser, 
    loginUser, 
    getProfile, 
    updateProfile,
    updatePassword,
    deleteProfile,
    sendResetPassword,
    verifyResetPassword,} = require ("../controlller/user.controller");
const {verifyAuthToken} = require ("../middleware/authenticate")

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/send_reset_password", sendResetPassword);
userRouter.post("/verify_reset_password", verifyResetPassword);

//AUTH TOKEN
userRouter.get("/profile", verifyAuthToken, getProfile);
userRouter.put("/update_profile", verifyAuthToken, updateProfile);
userRouter.put("/update_password", verifyAuthToken, updatePassword);
userRouter.delete("/delete_profile", verifyAuthToken, deleteProfile);

module.exports = userRouter;