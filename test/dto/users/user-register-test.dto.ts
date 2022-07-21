import { CreateUserDto } from "../../../src/users/dto/create-user.dto";

export const UserRegisterTestDtoStub = (): CreateUserDto => {
    return {
        email: "user@user.com",
        password: "Zxoubv!jf112"
    };
};
