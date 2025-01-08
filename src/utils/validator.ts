import Joi, { ObjectSchema } from "joi";
import { ApiError } from "../helper/ApiError";
import { ResponseUtil } from "./response";

/**
 * Validates a payload using a Joi schema.
 *
 * @param schema - Joi schema to validate against.
 * @param payload - Data to validate.
 * @returns Validated data or throws an error.
 */
export const validate = (schema: ObjectSchema, payload: any) => {
    const { error, value } = schema.validate(payload, { abortEarly: false });
    if (error) {
        console.log(error.message)
        throw ApiError.validationError(error.details.map((error) => error.message))
    }
    return value;
};
