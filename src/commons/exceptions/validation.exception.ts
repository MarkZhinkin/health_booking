import { HttpException, HttpStatus } from "@nestjs/common";

export class ValidationException extends HttpException {

    constructor(messages: Array<string>) {
        super(messages, HttpStatus.BAD_REQUEST);
    }
}
