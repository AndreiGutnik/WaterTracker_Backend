import { Schema, model } from "mongoose";

import { handleSaveError, preUpdate } from "./hooks.js";

export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 32,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userchema.post("save", handleSaveError);

userchema.pre("findOneAndUpdate", preUpdate);

userchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userchema);

export default User;
