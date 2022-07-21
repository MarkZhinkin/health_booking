import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { AuthController } from "../src/auth/auth.controller";
import { AuthService } from "../src/auth/auth.service";
import { UsersService } from "../src/users/users.service";
import { UsersController } from "../src/users/user.controller";
import { DoctorsService } from "../src/doctors/doctors.service";
import { DoctorsController } from "../src/doctors/doctors.controller";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection, connect, Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { User, UserSchema } from "../src/database/models/users";
import { Doctor, DoctorSchema } from "../src/database/models/doctors";
import { UserRegisterTestDtoStub, UserLoginTestDtoStub } from "./dto/users";
import { DoctorMockData } from "./dto/doctors";

describe("Auth Controller", () => {
    let userModel: Model<User>;
    let doctorModel: Model<Doctor>;

    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;

    let token: string;

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
            status: "active",
            isFree: true
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
            controllers: [
                AuthController,
                UsersController,
                DoctorsController
            ],
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
        it("/GET show unlogged user info", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/users/user")
                .set("Accept", "application/json");

            expect(response.statusCode).toEqual(401);
            expect(JSON.parse(response.text).message).toEqual("Forboden. User unauthorized.");
        });
        it("/POST update unlogged user info", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/users/user")
                .set("Accept", "application/json");
            
                expect(response.statusCode).toEqual(401);
                expect(JSON.parse(response.text).message).toEqual("Forboden. User unauthorized.");
        });
        it("/POST create new user", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/auth/registration")
                .send(UserRegisterTestDtoStub())
                .set("Accept", "application/json");

            expect(response.statusCode).toEqual(201);
            expect(!!JSON.parse(response.text).token).toBe(true);
            expect(JSON.parse(response.text).type).toEqual("bearer");
        });
        it("/POST login by correct password", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/auth/login")
                .send(UserLoginTestDtoStub())
                .set("Accept", "application/json");
            
            if (response.statusCode < 300) {
                const jsonResponse = JSON.parse(response.text);
                token = `Bearer ${jsonResponse.token}`;
            }
            
            expect(!!JSON.parse(response.text).token).toBe(true);
            expect(JSON.parse(response.text).type).toEqual("bearer");
        });
        it("/GET show user info", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/users/user")
                .set("Accept", "application/json")
                .set("Authorization", token);
            
            const jsonResponse = JSON.parse(response.text);

            expect(response.statusCode).toEqual(201);
            expect(jsonResponse.email).toEqual(UserLoginTestDtoStub().email);
            expect(jsonResponse.status).toEqual("notСonfirmed");
        });
        it("/POST update user phone", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/users/user")
                .set("Accept", "application/json")
                .set("Authorization", token)
                .send({ phone: "+380631234567" });
            
            const jsonResponse = JSON.parse(response.text);

            expect(response.statusCode).toEqual(201);
            expect(jsonResponse.email).toEqual(UserLoginTestDtoStub().email);
            expect(jsonResponse.phone).toEqual("+380631234567");
            expect(jsonResponse.status).toEqual("notСonfirmed");
        });
        it("/POST update user name and status", async () => {
            const response = await request(app.getHttpServer())
                .post("/test/users/user")
                .set("Accept", "application/json")
                .set("Authorization", token)
                .send({ name: "Jonh" });
            
            const jsonResponse = JSON.parse(response.text);

            expect(response.statusCode).toEqual(201);
            expect(jsonResponse.email).toEqual(UserLoginTestDtoStub().email);
            expect(jsonResponse.name).toEqual("Jonh");
            expect(jsonResponse.status).toEqual("active");
        });
        it("/GET show all doctors", async () => {
            const response = await request(app.getHttpServer())
                .get("/test/doctors/0")
                .set("Accept", "application/json")
                .set("Authorization", token);
            
            const jsonResponse = JSON.parse(response.text);

            expect(response.statusCode).toEqual(200);
            expect(jsonResponse.length).toEqual(1);
            expect(jsonResponse[0].email).toEqual(DoctorMockData.email);
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
