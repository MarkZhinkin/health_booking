import { LoginUserDto } from "../../../src/users/dto/login-user.dto";

export const UserLoginTestDtoStub = (): LoginUserDto => {
    return {
        email: "user@user.com",
        password: "Zxoubv!jf112",
        type: "user",
    };
};
