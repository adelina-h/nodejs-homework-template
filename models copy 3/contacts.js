const Contact = require("./contact");

const listContacts = async (filter = {}, skip = 0, limit = 20) => {
  return await Contact.find(filter).skip(skip).limit(Number(limit));
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const addContact = async (body) => {
  return await Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

const removeContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

const updateStatusContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
};
