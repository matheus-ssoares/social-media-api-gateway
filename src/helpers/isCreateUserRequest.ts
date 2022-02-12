import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../database/connection';
import { users_credentials } from '../database/models/users_credentials';
import { hash } from 'bcrypt';
import axios from 'axios';

const usersServiceHost = 'http://localhost:5000';

export async function isCreateUserRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isCreateRequest =
    req.originalUrl.includes('/users') && req.method === 'POST';

  if (!isCreateRequest) {
    next();
  }
  const transaction = await sequelize.transaction();

  const email = req.body?.email;

  const password = req.body?.password;

  if (!email || !password) {
    next();
  }
  try {
    await users_credentials.create(
      {
        email,
        password: await hash(password, 14),
        credential_token_version: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction },
    );
    const result = await axios.post(`${usersServiceHost}/users`, {
      ...req.body,
    });

    transaction.commit();
    return res.json(result.data);
  } catch (error) {
    transaction.rollback();
    if (axios.isAxiosError(error)) {
      return res
        .status(error.response?.status ?? 500)
        .json(error.response?.data ?? 'Internal server error');
    }
    next(error);
  }
}
