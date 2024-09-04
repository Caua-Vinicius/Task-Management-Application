import { Request } from 'express';

export interface UserInfoRequest extends Request {
  user_id: string;
  email: string;
}
