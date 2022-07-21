import { LoginUserDto } from "../../../src/users/dto/login-user.dto";

export const WrongDoctorPasswordTestDtoStub = (): LoginUserDto => {
    return {
        email: "doctor@doctor.com",
        password: "other_password",
        type: "doctor",
    };
};
