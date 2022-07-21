import { LoginUserDto } from "../../../src/users/dto/login-user.dto";

export const DoctorLoginTestDtoStub = (): LoginUserDto => {
    return {
        email: "doctor@doctor.com",
        password: "Zxoubv!jf112",
        type: "doctor",
    };
};
