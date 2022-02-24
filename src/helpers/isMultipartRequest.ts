import httpProxy from 'express-http-proxy';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.SOCIAL_POSTS_ENDPOINT;

const postsServiceProxyNoParse = httpProxy(PORT!, {
  parseReqBody: true,
});
const postsServiceProxyWithParse = httpProxy(PORT!, {
  parseReqBody: false,
});

export async function isMultipartRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.headers['content-type']?.split(';')[0] === 'multipart/form-data') {
    postsServiceProxyWithParse(req, res, next);
    return;
  }

  postsServiceProxyNoParse(req, res, next);
}
