import { BaseValidationRequest } from "./../request/BaseValidation.request";
import { NextFunction, Request, Response } from "express";
export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = (req.body as BaseValidationRequest).validationSchema;
  if (schema) {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, error: error.details[0].message });
      return;
    }
  }
  next();
}
