import { generateToken } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import { signupSchema } from "../schemas/auth.schema.js";
import bcrypt from "bcryptjs";
import z from "zod";
export const signup = async (req, res) => {
  try {
    //validate data
    const validateData = signupSchema.parse(req.body);
    const { fullName, email, password, profilePic } = validateData;

    //create user
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
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
        _id: newUser._id,
        fullName,
        email,
        profilePic,
        token,
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
export const login = (req, res) => {
  res.send("login route");
};
export const logout = (req, res) => {
  res.send("logout route");
};
