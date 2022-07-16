import { ApiProperty } from "@nestjs/swagger";

export class UserLoginResponse {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1Ni...agOc3KF62T70c", description: "Token value." })
    token: string;

    @ApiProperty({ example: "bearer", description: "Token type." })
    type: string;
}
