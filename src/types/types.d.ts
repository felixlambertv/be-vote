import { Role } from "./../enum/Role";
declare module "helmet";

export interface UserPayload {
  userId: string;
  name: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
