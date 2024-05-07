import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updContact,
} from "../services/contactsServices.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contactsList = await listContacts();
    res.status(200).send(contactsList);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const contact = await getContactById(req.params.id);
  try {
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await removeContact(id);
  try {
    if (contact) {
      res.status(200).send(contact);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;

  const { error } = createContactSchema.validate({
    name,
    email,
    phone,
  });
  if (typeof error !== "undefined") {
    return res.status(400).json({ message: error.message });
  }
  try {
    const contact = await addContact(name, email, phone);
    res.status(201).send(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { id } = req.params;

  const { error } = updateContactSchema.validate({
    name,
    email,
    phone,
  });

  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .send({ message: "Body must have at least one field" });
  }

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const contact = await updContact(id, req.body);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};
