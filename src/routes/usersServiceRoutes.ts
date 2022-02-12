import express from 'express';
import httpProxy from 'express-http-proxy';
import { protect } from '../controllers/AuthController';
import { isCreateUserRequest } from '../helpers/isCreateUserRequest';

const usersServiceRoutes = express.Router();

const usersServiceProxy = httpProxy('http://localhost:5000');

usersServiceRoutes.all('*', protect, isCreateUserRequest, usersServiceProxy);

export default usersServiceRoutes;
