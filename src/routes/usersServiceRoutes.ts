import express from 'express';
import httpProxy from 'express-http-proxy';
import { protect } from '../controllers/AuthController';

const usersServiceRoutes = express.Router();

const usersServiceProxy = httpProxy('http://localhost:5000');

usersServiceRoutes.all('*', protect, usersServiceProxy);

export default usersServiceRoutes;
