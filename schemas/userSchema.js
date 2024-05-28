import Joi from "joi";

const validSubscription = ["starter", "pro", "business"]

export const createUserSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const updateSubscriptionSchema = Joi.object({
subscription: Joi.string().valid(...validSubscription).required(),
})