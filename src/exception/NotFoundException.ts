import { HttpStatus } from "./../enum/HttpStatus";
import BaseException from "./BaseException";

export default class NotFoundException extends BaseException {
  constructor(data: string) {
    super(`${data} not found`, HttpStatus.NOT_FOUND);
  }
}
