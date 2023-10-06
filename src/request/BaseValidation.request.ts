import Joi from "joi";

export interface BaseValidationRequest {
  validationSchema: Joi.ObjectSchema;
}
