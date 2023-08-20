import { Expose } from 'class-transformer';

export class ApiBaseResponse {
    @Expose()
    message: string;
    @Expose()
    status: number;
    @Expose()
    data: any;

    constructor(message: string, status: number, data: any) {
        this.message = message;
        this.status = status;
        this.data = data;
    }
}
