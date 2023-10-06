import { Role } from "./../enum/Role";
export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}
