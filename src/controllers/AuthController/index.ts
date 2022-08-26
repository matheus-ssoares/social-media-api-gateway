import { NextFunction, Response, Request } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { users_credentials } from '../../database/models/users_credentials';
import * as bcrypt from 'bcrypt';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import {
  AuthenticateRequestSchema,
  CreateCredentialsRequestSchema,
} from './schemas';
import { GenericError, NotFoundError } from '../../helpers/error';

import * as dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const createCredentials = async (
  req: ValidatedRequest<CreateCredentialsRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body;

  try {
    const user = await users_credentials.create({
      email: body.email,
      password: await bcrypt.hash(body.password, 14),
      credential_token_version: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
export const authenticate = async (
  req: ValidatedRequest<AuthenticateRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body;

  try {
    const user = await users_credentials.findOne({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new NotFoundError();
    }
    const isValid = await compare(body.password, user.password);

    if (!isValid) {
      throw new GenericError(400, 'e-mail or password is invalid');
    }

    const token = jwt.sign(
      {
        id: user.id,
        token_version: user.credential_token_version + 1,
      },
      ACCESS_TOKEN_SECRET!,
      {
        expiresIn: '1d',
      },
    );
    await users_credentials.update(
      { credential_token_version: user.credential_token_version + 1 },
      { where: { id: user.id } },
    );
    res.status(200).json({ email: user.email, token });
  } catch (error) {
    next(error);
  }
};
interface SpecialRoute {
  requestHttpType: string;
  path: string;
  isPersonalRoute?: boolean;
  isOpen: boolean;
}
const specialRoutes: SpecialRoute[] = [
  {
    path: '/social-users/users',
    requestHttpType: 'POST',
    isOpen: true,
  },
  {
    path: '/social-users/users',
    requestHttpType: 'GET',
    isOpen: true,
  },
];

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const findPathNameDeadline =
    req.originalUrl.indexOf('?') !== -1
      ? req.originalUrl.indexOf('?')
      : req.originalUrl.length;

  const isSpecialRoute = specialRoutes.find(
    route =>
      route.path === req.originalUrl.substring(0, findPathNameDeadline) &&
      route.requestHttpType === req.method,
  );

  if (isSpecialRoute && isSpecialRoute.isOpen) {
    return next();
  }
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ error: 'No token provided' });

  jwt.verify(
    authHeader,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ACCESS_TOKEN_SECRET!,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (err: VerifyErrors | null, decoded: any) => {
      if (err) return res.status(401).send({ error: 'Token invalid' });

      const user = await users_credentials.findOne({
        where: { id: decoded.id },
      });
      const isPersonalRoute = isSpecialRoute && isSpecialRoute.isPersonalRoute;
      const idIsDifferent = user && user.external_id !== req.query.id;

      if (isPersonalRoute && idIsDifferent) {
        return res.sendStatus(401);
      }

      if (user && decoded.token_version === user.credential_token_version) {
        return next();
      }
      return res.status(401).send({ error: 'Token invalid' });
    },
  );
};
