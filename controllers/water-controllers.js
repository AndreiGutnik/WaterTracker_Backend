import Water from "../models/Water.js";
import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const getAllWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, ...filterParams } = req.query;
  const skip = (page - 1) * limit;
  const filter = { owner, ...filterParams };
  const result = await Water.find(filter, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner");
  const total = await Water.countDocuments(filter);
  res.json({
    result,
    total,
  });
};

const getWaterById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Water.findOne({ _id: id, owner });
  // const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addWater = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Water.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteWaterById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  // const result = await Contact.findByIdAndDelete(id);
  const result = await Water.findOneAndDelete({ _id: id, owner });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  // res.status(204).send();
  res.json({
    message: "water deleted",
  });
};

const updateWaterById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  // const result = await Contact.findByIdAndUpdate(id, req.body);
  const result = await Water.findOneAndUpdate({ _id: id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

export default {
  getAllWater: ctrlWrapper(getAllWater),
  getWaterById: ctrlWrapper(getWaterById),
  addWater: ctrlWrapper(addWater),
  deleteWaterById: ctrlWrapper(deleteWaterById),
  updateWaterById: ctrlWrapper(updateWaterById),
};
