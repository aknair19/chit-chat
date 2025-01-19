import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import { loginSchema, signupSchema } from "../schemas/auth.schema.js";
import bcrypt from "bcryptjs";
import z from "zod";
export const signup = async (req, res) => {
  try {
    //validate data from client using zod
    const validateData = signupSchema.parse(req.body);
    const { fullName, email, password, profilePic } = validateData;

    //check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with email already exists",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    //create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic: "",
    });

    if (newUser) {
      //generate jwt token here
      const token = generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        success: true,
        message: "User Created Successfully",
        data: {
          _id: newUser._id,
          fullName,
          email,
          profilePic,
          token,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    //handle validation error
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors,
      });
    }
    console.log(error);
    return res
      .json({
        success: false,
        message: "Internal server error",
      })
      .status(500);
  }
};
export const login = async (req, res) => {
  try {
    const validateData = loginSchema.parse(req.body);
    const { email, password } = validateData;
    //check if user exists with email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    //check password
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    //generate  token
    const token = generateToken(user._id, res);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  //in order to upload media we need a service. SO here we are using cloudinary
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "Please provide a profile picture",
      });
    }
    const uploadResponse = await cloudinary.uploader
      .upload(profilePic)
      .catch((error) => {
        console.log(error);
      });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "Profile has been updated",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      status: true,
      user: req.user,
    });
  } catch (error) {
    console.log("Error in checkAuth controller");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
