import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { AuthController } from "../src/auth/auth.controller";
import { AuthService } from "../src/auth/auth.service";
import { UsersService } from "../src/users/users.service";
import { DoctorsService } from "../src/doctors/doctors.service";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection, connect, Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { User, UserSchema } from "../src/database/models/users";
import { Doctor, DoctorSchema } from "../src/database/models/doctors";
import { UserRegisterTestDtoStub, UserLoginTestDtoStub, WrongUserPasswordTestDtoStub } from "./dto/users";
import { DoctorLoginTestDtoStub, DoctorMockData, WrongDoctorPasswordTestDtoStub } from "./dto/doctors";

describe("Auth Controller", () => {
    let userModel: Model<User>;
    let doctorModel: Model<Doctor>;

    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;

    let app: INestApplication;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        userModel = mongoConnection.model(User.name, UserSchema);
        doctorModel = mongoConnection.model(Doctor.name, DoctorSchema);

        await doctorModel.create({
            email: DoctorMockData.email,
            regToken: DoctorMockData.regToken,
            specialization: DoctorMockData.specialization,
        });

        const moduleRef = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: process.env.PRIVATE_KEY || "PRIVATE_KEY",
                    signOptions: {
                        expiresIn: "24h",
                    },
                }),
            ],
            controllers: [AuthController],
            providers: [
                AuthService,
                UsersService,
                DoctorsService,
                {
                    provide: getModelToken(User.name),
                    useValue: userModel,
                },
                {
                    provide: getModelToken(Doctor.name),
                    useValue: doctorModel,
                },
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        app.setGlobalPrefix("/test");

        await app.init();
    });

    describe("User", () => {
        it("/POST create new user", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/auth/registration")
                .send(UserRegisterTestDtoStub())
                .set("Accept", "application/json");

            expect(response.statusCode).toEqual(201);
            expect(!!JSON.parse(response.text).token).toBe(true);
            expect(JSON.parse(response.text).type).toEqual("bearer");
        });
        it("/POST create already exist user", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/auth/registration")
                .send(UserRegisterTestDtoStub())
                .set("Accept", "application/json");

            expect(response.statusCode).toEqual(400);
            expect(JSON.parse(response.text).message).toEqual("User already exist.");
        });
        it("/POST login by wrong password", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/auth/login")
                .send(WrongUserPasswordTestDtoStub())
                .set("Accept", "application/json");

            expect(response.statusCode).toEqual(401);
            expect(JSON.parse(response.text).message).toEqual("No such user/password pair exists.");
        });
        it("/POST login by correct password", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/auth/login")
                .send(UserLoginTestDtoStub())
                .set("Accept", "application/json");

            expect(!!JSON.parse(response.text).token).toBe(true);
            expect(JSON.parse(response.text).type).toEqual("bearer");
        });
    });

    describe("Doctor", () => {
        it("/POST login by correct password", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/auth/login")
                .send(DoctorLoginTestDtoStub())
                .set("Accept", "application/json");

            expect(!!JSON.parse(response.text).token).toBe(true);
            expect(JSON.parse(response.text).type).toEqual("bearer");
        });
        it("/POST login by wrong password", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/auth/login")
                .send(WrongDoctorPasswordTestDtoStub())
                .set("Accept", "application/json");

            expect(response.statusCode).toEqual(401);
            expect(JSON.parse(response.text).message).toEqual("No such user/password pair exists.");
        });
    });

    afterAll(async () => {
        const collections = mongoConnection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }

        await mongoConnection.dropDatabase();
        await mongoConnection.close();
        await mongod.stop();

        await app.close();
    });
});
