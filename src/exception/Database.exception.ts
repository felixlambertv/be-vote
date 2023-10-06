import { HttpStatus } from "./../enum/HttpStatus";
import BaseException from "./BaseException";

export class DatabaseException extends BaseException {
  constructor(message: string) {
    super(`Fail to execute ${message} data`, HttpStatus.BAD_REQUEST);
  }
}
