import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import Joi from 'joi';

export interface CreateCredentialsRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    email: string;
    password: string;
  };
}

export const createCredentialsSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export interface AuthenticateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    email: string;
    password: string;
  };
}

export const authenticateSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
