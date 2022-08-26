import httpProxy from 'express-http-proxy';
import express from 'express';
import { protect } from '../controllers/AuthController';
import {} from '../helpers/isMultipartRequest';

const chatsServiceRoutes = express.Router();

const chatsServiceProxy = httpProxy('http://localhost:7000');

chatsServiceRoutes.all('*', protect, chatsServiceProxy);

export default chatsServiceRoutes;
