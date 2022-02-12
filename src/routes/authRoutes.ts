import express from 'express';
import * as AuthController from '../controllers/AuthController';
import { authenticateSchema } from '../controllers/AuthController/schemas';
import { SchemaTypes, validation } from '../helpers/validation';

const authRoutes = express.Router();

// authRoutes.post(
//   '/',
//   (req, res, next) =>
//     validation(
//       [{ type: SchemaTypes.BODY, schema: createCredentialsSchema }],
//       req,
//       res,
//       next,
//     ),
//   AuthController.createCredentials,
// );

authRoutes.post(
  '/login',
  (req, res, next) =>
    validation(
      [{ type: SchemaTypes.BODY, schema: authenticateSchema }],
      req,
      res,
      next,
    ),
  AuthController.authenticate,
);

export default authRoutes;
