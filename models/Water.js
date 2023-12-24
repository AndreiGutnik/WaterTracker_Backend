import { Schema, model } from "mongoose";

import { handleSaveError, preUpdate } from "./hooks.js";

const waterSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    amountWater: {
      type: Number,
      min: 0,
      max: 5000,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

waterSchema.post("save", handleSaveError);

waterSchema.pre("findOneAndUpdate", preUpdate);

waterSchema.post("findOneAndUpdate", handleSaveError);

const Water = model("water", waterSchema);

export default Water;
