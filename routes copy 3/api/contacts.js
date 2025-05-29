const authenticate = require("../../middlewares/authenticate");
const express = require("express");
const router = express.Router();
const contacts = require("../../models/contacts");
const {
  addContactSchema,
  updateContactSchema,
} = require("../../schemas/contactsSchemas");
const validateBody = require("../../middlewares/validateBody");
const { updateStatusContact } = require("../../models/contacts");


router.get("/", authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;

    const filter = { owner: req.user._id };
    if (favorite !== undefined) {
      filter.favorite = favorite === "true";
    }

    const contactsList = await contacts.listContacts(filter, skip, limit);
    res.status(200).json(contactsList);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contacts.getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  authenticate,
  validateBody(addContactSchema),
  async (req, res, next) => {
    try {
      const newContact = await contacts.addContact({
        ...req.body,
        owner: req.user._id,
      });
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:contactId", authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contacts.removeContact(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:contactId",
  authenticate,
  validateBody(updateContactSchema),
  async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const updatedContact = await contacts.updateContact(contactId, req.body);

      if (!updatedContact) {
        return res.status(404).json({ message: "Not Found" });
      }

      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/:contactId/favorite", authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: "missing field favorite" });
    }
    const updatedContact = await updateStatusContact(contactId, { favorite });

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
