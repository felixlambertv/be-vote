import { HttpStatus } from "../enum/HttpStatus";
import BaseException from "./BaseException";

export class DataExistsException extends BaseException {
  constructor(data: string) {
    super(`${data} already exists`, HttpStatus.CONFLICT);
  }
}
