import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    email: Joi.string(),
    phone: Joi.string(),
})