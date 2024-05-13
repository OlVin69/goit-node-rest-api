import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    email: Joi.string(),
    phone: Joi.string(),
    favorite: Joi.boolean(),
});

export const updateStatusContactSchema = Joi.object({
    favorite: Joi.boolean().required(),
});
