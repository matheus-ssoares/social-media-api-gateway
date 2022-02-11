import express from 'express';
import httpProxy from 'express-http-proxy';

const postsServiceRoutes = express.Router();

const postsServiceProxy = httpProxy('http://localhost:6000');
postsServiceRoutes.all('*', (req, res, next) =>
  postsServiceProxy(req, res, next),
);

export default postsServiceRoutes;
