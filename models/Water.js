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

const Water = model("waternote", waterSchema);

export default Water;

// const getWaterByDate = async (req, res) => {
//   const { _id: ownerId, name, email, waterRate } = req.user;

//   const specifiedDate = new Date();
//   specifiedDate.setUTCHours(0, 0, 0, 0);
//   const startDateISO8601 = specifiedDate.toISOString();
//   specifiedDate.setUTCHours(23, 59, 59, 999);
//   const endDateISO8601 = specifiedDate.toISOString();
//   console.log(startDateISO8601);
//   console.log(endDateISO8601);
//   const filter = {
//     ownerId,
//     date: { $gte: startDateISO8601, $lt: endDateISO8601 },
//   };

//   const waterNotes = await Water.find(filter, "-ownerId -createdAt -updatedAt");
//   const total = await Water.countDocuments(filter);

//   res.json({
//     infoForDay: {
//       ownerId,
//       name,
//       email,
//       waterRate,
//       waterNotes,
//       total,
//     },
//   });
// };
