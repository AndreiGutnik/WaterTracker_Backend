import Contact from "../models/Contact.js";
import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, ...filterParams } = req.query;
  const skip = (page - 1) * limit;
  const filter = { owner, ...filterParams };
  const result = await Contact.find(filter, "-createdAt -updatedAt", { skip, limit }).populate(
    "owner",
    "email subscription"
  );
  const total = await Contact.countDocuments(filter);
  res.json({
    result,
    total,
  });
};

const getContactById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.findOne({ _id: id, owner });
  // const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteContactById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  // const result = await Contact.findByIdAndDelete(id);
  const result = await Contact.findOneAndDelete({ _id: id, owner });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  // res.status(204).send();
  res.json({
    message: "contact deleted",
  });
};

const updateContactById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  // const result = await Contact.findByIdAndUpdate(id, req.body);
  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  deleteContactById: ctrlWrapper(deleteContactById),
  updateContactById: ctrlWrapper(updateContactById),
};
