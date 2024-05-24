import Contact from "../models/contact.js";
import { isValidObjectId } from "mongoose";

import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contactsList = await Contact.find({ ownerId: req.user.id });
    res.status(200).send(contactsList);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }
    const contact = await Contact.findByOne({ _id: id, owner: req.user.id });

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

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }
    const contact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (contact !== null) {
      res.status(200).send(contact);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;

  try {
    const { error } = createContactSchema.validate({
      name,
      email,
      phone,
      favorite,
    });
    if (typeof error !== "undefined") {
      return res.status(400).json({ message: error.message });
    }

    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
      owner: req.user.id,
    };
    const result = await Contact.create(contact);

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  const { id } = req.params;

  try {
    const { error } = updateContactSchema.validate({
      name,
      email,
      phone,
      favorite,
    });

    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .send({ message: "Body must have at least one field" });
    }

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contact = Contact.findOne({ _id: id, owner: req.user.id });

    if (!contact) {
      res.status(404).send({ message: "Not found" });
    }

    const newContact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
    };
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }
    const result = await Contact.findByIdAndUpdate(id, newContact, {
      new: true,
    });

    if (result !== null) {
      res.status(200).json(result);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const { error } = updateStatusContactSchema.validate({
      favorite,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contact = Contact.findOne({ _id: id, owner: req.user.id });

    if (!contact) {
      res.status(404).send({ message: "Not found" });
    }

    const result = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      {
        new: true,
      }
    );
    
    if (result !== null) {
      res.status(200).json(result);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};
