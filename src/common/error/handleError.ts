import { NotAcceptableException, NotFoundException } from "@nestjs/common";

export class ErrorHandlingService {
    static handle(error: any) {
        if (error instanceof NotFoundException) {
            throw new NotFoundException('Resource not found', error.message);
        } else {
            throw new NotAcceptableException('An error occurred', error.message);
        }
    }
}