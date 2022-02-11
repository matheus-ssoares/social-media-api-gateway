/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request, NextFunction } from 'express';
import Joi from 'joi';

export enum SchemaTypes {
  HEADER = 'header',
  BODY = 'body',
  PARAMS = 'params',
}
interface ParamsSchema {
  type: SchemaTypes;
  schema: Joi.ObjectSchema<any>;
}

export function validation(
  schemas: ParamsSchema[],
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let errors: any = [];

  schemas.forEach(schemaToValidate => {
    const { error } = schemaToValidate.schema.validate(
      req[schemaToValidate.type],
      {
        abortEarly: false,
      },
    );
    if (error) {
      errors = [...errors, ...error.details];
    }
  });

  if (errors.length > 0) {
    return res.status(422).send({
      message: 'Validation error',
      details: errors,
    });
  } else {
    next();
  }
}
