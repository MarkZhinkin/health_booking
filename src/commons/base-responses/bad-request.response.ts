import { ApiProperty } from "@nestjs/swagger";

export class BadRequestResponse {
    @ApiProperty({ example: 400, description: "Error status code." })
    statusCode: number;

    @ApiProperty({ example: "User already exist.", description: "Error message." })
    message: string;
}
