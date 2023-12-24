import express from "express";

import contactsController from "../../controllers/contacts-controllers.js";
import {
  authenticate,
  isEmptyBody,
  isEmptyBodyFavorite,
  isValidId,
} from "../../middleware/index.js";
import { validateBody } from "../../decorators/index.js";
import {
  contactAddSchema,
  contactFavoriteSchema,
  contactUpdateSchema,
} from "../../schemas/contacts-schemas.js";

const router = express.Router();

router.use(authenticate);

router.get("/", contactsController.getAllContacts);

router.get("/:id", isValidId, contactsController.getContactById);

router.post(
  "/",
  isEmptyBody,
  validateBody(contactAddSchema),
  contactsController.addContact
);

router.delete("/:id", isValidId, contactsController.deleteContactById);

router.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(contactUpdateSchema),
  contactsController.updateContactById
);

router.patch(
  "/:id/favorite",
  isValidId,
  isEmptyBodyFavorite,
  validateBody(contactFavoriteSchema),
  contactsController.updateContactById
);

export default router;
