import { Role } from "./../enum/Role";
export interface UserUpdateDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
}
