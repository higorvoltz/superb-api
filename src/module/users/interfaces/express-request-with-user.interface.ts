import { Request as ExpressRequest } from 'express';
import { UserPaload } from './users-login.interface';

export interface ExpressRequestWithUser extends ExpressRequest {
  user: UserPaload & { iat: number; exp: number };
}
