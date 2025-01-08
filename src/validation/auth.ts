import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string()
        .min(1)
        .required()
    ,
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
    ,
    password: Joi.string()
        .min(6)
        .required()
    ,
}).options({ abortEarly: false })

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
    ,
    password: Joi.string()
        .min(1)
        .required()
    ,
}).options({ abortEarly: false })


export const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()

}).options({ abortEarly: false })


export const recoverPasswordSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
    ,
    authCode: Joi.string()
        .min(1)
        .required(),
    newPassword: Joi.string()
        .min(6)
        .required()

}).options({ abortEarly: false })



export const resendAuthCodeSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()

}).options({ abortEarly: false })

