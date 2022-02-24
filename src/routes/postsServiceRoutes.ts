import express from 'express';
import { protect } from '../controllers/AuthController';
import { isMultipartRequest } from '../helpers/isMultipartRequest';

const postsServiceRoutes = express.Router();

postsServiceRoutes.all('*', protect, isMultipartRequest);

export default postsServiceRoutes;
