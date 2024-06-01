import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authorization = req.header('Authorization')?.replace('Bearer ', '');
  if (!authorization) {
    return res.status(401).send('Access Denied');
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = { id: decoded.id };
    return next();
  } catch (error) {
    return res.status(400).send('Invalid Token');
  }
};

export default auth;
