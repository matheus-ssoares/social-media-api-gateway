/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import './database/connection';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { handleError } from './helpers/error';
import authRoutes from './routes/authRoutes';
import postsServiceRoutes from './routes/postsServiceRoutes';
import usersServiceRoutes from './routes/usersServiceRoutes';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { protect } from './controllers/AuthController';
import chatsServiceRoutes from './routes/chatsServiceRoutes';

dotenv.config();

const PORT = process.env.PORT || 6001;

const app = express();
const webSocketProxyOptions = {
  target: 'http://localhost:7000', // target host with the same base path
  changeOrigin: true, // needed for virtual hosted sites
};

const webSocketProxy = createProxyMiddleware(webSocketProxyOptions);

app.use(
  cors({
    origin: ['http://localhost:3000'],
  }),
);
app.use(express.json({ limit: '10000mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

app.use('/social-users', usersServiceRoutes);

app.use('/social-posts', postsServiceRoutes);

app.use('/social-chats', chatsServiceRoutes);

const expressServer = http.createServer(app);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(protect, webSocketProxy);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleError(err, res);
});

expressServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
