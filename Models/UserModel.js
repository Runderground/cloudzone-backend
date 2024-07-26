const mongoose = require("mongoose");
const defaultProfile = ["default-profile-blue.png", "default-profile-orange.png", "default-profile-red.png", "default-profile-purple.png"]

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: 25,
      required: true,
    },
    username: {
      type: String,
      maxLength: 15,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    profilePicture: {
      type: String,
      default: () => defaultProfile[Math.floor(Math.random() * defaultProfile.length)]
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel