import { UserPayload } from "./../types/types.d";
import { Tokens } from "./../services/Auth.service";

export interface LoginResponse {
  tokens: Tokens;
  user: UserPayload;
}
