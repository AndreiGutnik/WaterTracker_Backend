import { Schema, model } from "mongoose";

import { handleSaveError, preUpdate } from "./hooks.js";

export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userchema = new Schema(
  {
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 64,
      required: true,
    },
    newPassword: {
      type: String,
      minLength: 8,
      maxLength: 64,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    name: {
      type: String,
      minLength: 3,
      maxLength: 24,
      default: "User",
    },
    waterRate: {
      type: Number,
      max: 15000,
      default: 2000,
    },
    avatarURL: {
      type: String,
      default: "https://res.cloudinary.com/dhobomrxe/image/upload/v1704619800/avatar_ckqfza.png",
      required: true,
    },
    token: {
      type: String,
      default: null,
    },

    // verify: {
    //   type: Boolean,
    //   default: false,
    // },
    // verificationToken: {
    //   type: String,
    // },
  },
  { versionKey: false, timestamps: true }
);

userchema.post("save", handleSaveError);

userchema.pre("findOneAndUpdate", preUpdate);

userchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userchema);

export default User;
