import { Role } from "../enum/Role";

export class UserRequest {
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: Role;
}
