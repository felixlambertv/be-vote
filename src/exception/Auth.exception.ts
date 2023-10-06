import { HttpStatus } from "../enum/HttpStatus";
import BaseException from "./BaseException";

export class InvalidCredential extends BaseException {
  constructor() {
    super("Invalid credential", HttpStatus.BAD_REQUEST);
  }
}
