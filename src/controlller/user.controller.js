const {generateToken} = require("../helpers/AuthToken")
const { validateData } = require("../helpers/helper");
const User = require("../models/user.model")
const bcrypt = require("bcrypt");
const {sendEmail} = require("../service/emailservice")
const {BadrequestError, 
  NotFoundError, 
  ConflictError, 
  InternalServerError} = require("../middleware/customerror")


// signup endpoint
async function registerUser(req, res) {
  const data = req.body;
  const keys = ["name", "password", "email"];
  const validation = validateData(data, keys);

  if (validation.error) {
    return res.status(400).json({ message: `${validation.key} ${validation.message}` });
  }

  try {
    const emailExist = await User.find({ email: data.email });

    if (emailExist.length > 0) {
      throw new ConflictError("An account with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = bcrypt.hashSync(data.password, salt);
    data.password = hashPassword;

    const newUser = await User.create(data);

    await sendEmail(data.email, 'Account successfully created', 'Hello, you have successfully signed up to Audio-commerce');
    console.log('Signup email sent');

    return res.status(200).json({ message: "User Registered successfully", success: true, data: newUser });
  } catch (error) {
    if (error instanceof ConflictError) {
      return res.status(409).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" , success:false});
    }

    console.error('Error registering user:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// login endpoint 
async function loginUser(req, res) {
  try {
    const data = req.body;
    const keys = ["password", "email"];
    const validation = validateData(data, keys);

    if (validation.error) {
      return res.status(400).json({ message: `${validation.key} ${validation.message}` });
    }

    const user = await User.findOne({ email: data.email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist", success:false });
    }

    const isPasswordMatched = await bcrypt.compare(data.password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Incorrect Password", success: false });
    }

    try {
      await sendEmail(data.email, 'Audio-commerce', `Hi ${user.name}, you logged into your account. If this login did not originate from you, please let us know.`);
      console.log('Login email sent');
    } catch (error) {
      console.error('Error sending login email', error);
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "User Logged in successfully",
      data: {
        token,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


//send reseet password endpoint 

function generateRandomCode(length = 6) {
  const characters = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

async function sendResetPassword(req, res) {
  try {
    const data = req.body;

    if (!data.email)
      return res.status(400).json({
        message: "Email is required",
      });

    const user = await User.findOne({ email: data.email });
    if (!user) return res.status(400).json({ message: "User does not exist ", success:false });

    const code = generateRandomCode(); 
    user.resetPasswordToken = code;
    await user.save();

    await sendEmail(data.email, 'Reset Password Code', `Your reset password code is: ${code}`);

    return res.status(200).json({
      message: "Reset Password code sent",
      success:true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


// verify reset password endpoint

async function verifyResetPassword(req, res) {
  try {
    const data = req.body;

    if (!data.email)
      return res.status(400).json({
        message: "Email is required",
      });
    if (!data.newPassword)
      return res.status(400).json({
        message: "newPassword is required",
      });
    if (!data.code)
      return res.status(400).json({
        message: "code is required",
      });

    const user = await User.findOne({ email: data.email });
    if (!user) return res.status(400).json({ message: "User does not exist ", success:false });

    if (user.resetPasswordToken !== data.code) {
      return res.status(400).json({
        message: "Code is incorrect",
        success: false
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = bcrypt.hashSync(data.newPassword, salt);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    await user.save();

    await sendEmail(data.email, 'Password Reset Successfully, Your password has been successfully reset.');

    return res.status(200).json({
      message: "User Password Reset successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


// get profile endpoint 
async function getProfile(req, res) {
  try {
    const user = req.user;
    user.password = undefined;
    return res.status(200).json({
      message: "User Fetched successfully",
      success:true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}



// update profile endpoint 

async function updateProfile(req, res) {
  try {
    const { name, country } = req.body;
    const userReq = req.user;
    const user = await UserModel.findById(userReq._id);
    // if (name) user.name = name;
    // if (country) user.country = country;

    // await user.save();
    await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        name: name || user.name,
        country: country || user.country,
      }
    );

    return res.status(200).json({
      message: "User Profile updated successfully",
      success:true
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}



// change password endpoint
async function updatePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;

    if (!oldPassword)
      return res.status(400).json({
        message: "oldPassword is required",
      });

    if (!newPassword)
      return res.status(400).json({
        message: "newPassword is required",
      });

    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Incorrect Password" , success:false});
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = bcrypt.hashSync(newPassword, salt);

    await User.findOneAndUpdate(
      { _id: user._id },
      {
        password: hashPassword,
      }
    );

    try {
      await sendEmail(user.email, 'Password Change Successful', 'Your password has been successfully changed.');
      console.log('Password change email sent');
    } catch (error) {
      console.error('Error sending password change email:', error);
    }

    return res.status(200).json({
      message: "User Password updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}



// delete profile endpoint
async function deleteProfile(req, res) {
  try {
    const { password } = req.body;
    const user = req.user;
    if (!password)
      return res.status(400).json({
        message: "password is required",
      });

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Incorrect Password", success:false });
    }
    await UserModel.findOneAndDelete({ _id: user._id });
    return res.status(200).json({
      message: "User Deleted successfully",
      success: true
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  sendResetPassword,
  getProfile,
  verifyResetPassword,
  deleteProfile,
  updatePassword,
  updateProfile,
};