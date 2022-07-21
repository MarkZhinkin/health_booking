import { LoginUserDto } from "../../../src/users/dto/login-user.dto";

export const WrongUserPasswordTestDtoStub = (): LoginUserDto => {
    return {
        email: "user@user.com",
        password: "other_password",
        type: "user",
    };
};
