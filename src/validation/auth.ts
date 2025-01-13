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
})

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
    ,
    password: Joi.string()
        .min(1)
        .required()
    ,
})


export const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()

})


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

})



export const resendAuthCodeSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()

})

