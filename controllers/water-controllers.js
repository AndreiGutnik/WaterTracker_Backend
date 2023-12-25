import Water from "../models/Water.js";
import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const getAllWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, ...filterParams } = req.query;
  const skip = (page - 1) * limit;
  const filter = { owner, ...filterParams };
  console.log(filter.currentDate);
  const result = await Water.find(filter, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email gender waterRate");
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
  // const result = await Water.findById(id);
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
    message: "Delete successfully",
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

const getWaterByDate = async (req, res) => {
  const { _id: owner } = req.user;
  const { currentDate } = req.query;

  if (!currentDate) {
    throw HttpError(400, "Query parameter missing");
  }

  const specifiedDate = new Date(currentDate);
  specifiedDate.setUTCHours(0, 0, 0, 0);
  const startDateISO8601 = specifiedDate.toISOString();
  specifiedDate.setUTCHours(23, 59, 59, 999);
  const endDateISO8601 = specifiedDate.toISOString();

  const result = await Water.find({
    owner,
    date: { $gte: startDateISO8601, $lt: endDateISO8601 },
  }).exec();

  res.json({
    result,
  });
};

const getWaterByMonth = async (req, res) => {
  const { _id: owner } = req.user;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    throw HttpError(400, "Query parameter missing");
  }

  const startSpecifiedDate = new Date(startDate);
  startSpecifiedDate.setUTCHours(0, 0, 0, 0);
  const startDateISO8601 = startSpecifiedDate.toISOString();

  const endSpecifiedDate = new Date(endDate);
  endSpecifiedDate.setUTCHours(23, 59, 59, 999);
  const endDateISO8601 = endSpecifiedDate.toISOString();

  const result = await Water.find({
    owner,
    date: { $gte: startDateISO8601, $lt: endDateISO8601 },
  }).exec();

  res.json({
    result,
  });
};

export default {
  getAllWater: ctrlWrapper(getAllWater),
  getWaterById: ctrlWrapper(getWaterById),
  addWater: ctrlWrapper(addWater),
  deleteWaterById: ctrlWrapper(deleteWaterById),
  updateWaterById: ctrlWrapper(updateWaterById),
  getWaterByDate: ctrlWrapper(getWaterByDate),
  getWaterByMonth: ctrlWrapper(getWaterByMonth),
};
