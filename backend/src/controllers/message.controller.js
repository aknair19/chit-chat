import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } });
    req.json({ success: true, data: filteredUsers }).status(200);
  } catch (error) {
    console.log("Error in getUserForSidebar: ", error.message);
    res.json({ success: false, message: "Internal sever error" }).status(500);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.log("Error in getMessages: ", error.message);
    res.json({ success: false, message: "Internal sever error" }).status(500);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageURL;
    if (image) {
      //upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader
        .upload(image)
        .catch((error) => {
          console.log(error);
        });
      imageURL = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });
    await newMessage.save();
    res.status(200).json({
      success: true,
      data: newMessage,
    });
    //real time functionality socket.io goes here
  } catch (error) {
    console.log("Error in sendMessage: ", error.message);
    res.json({ success: false, message: "Internal sever error" }).status(500);
  }
};
