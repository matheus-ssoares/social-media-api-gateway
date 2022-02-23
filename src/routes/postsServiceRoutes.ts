import express from 'express';
import httpProxy from 'express-http-proxy';
import dotenv from 'dotenv';

const postsServiceRoutes = express.Router();

dotenv.config();

const PORT = process.env.SOCIAL_POSTS_ENDPOINT;

const postsServiceProxy = httpProxy(PORT!, {
  reqBodyEncoding: null,
  parseReqBody: false,
});
postsServiceRoutes.all('*', postsServiceProxy);

export default postsServiceRoutes;
