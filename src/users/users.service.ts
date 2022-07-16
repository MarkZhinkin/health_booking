import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User, UserDocument } from "../database/models/users";
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async createUser(dto: {email: string, regToken: string}): Promise<User> {
        return await this.userModel.create(dto);
    }
    
    async getUserByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ where: { email }, include: { all: true } });
    }

    async getUserById(id: Types.ObjectId, isShowId: 0 | 1 = 0): Promise<User> {
        return await this.userModel.findById(id).select({
            _id: isShowId, email: 1, name: 1, phone: 1, photoAvatar: 1, status: 1 
        });
    }

    async updateUserInfoById(id: Types.ObjectId, body: { name?: string | undefined, phone?: string | undefined }) {
        let user = await this.userModel.findOneAndUpdate(
            {id: id}, 
            {name: body.name, phone: body.phone}
        )
        if (body.name) {
            user.name = body.name;
        }
        if (body.phone) {
            user.phone = body.phone;
        }
        
        if (user.phone && user.name && user.status === "notСonfirmed") {
            user = await this.userModel.findOneAndUpdate(
                {id: id}, 
                {status: "active"}
            )
        }
    }

    async updateUserPhotoById(id: Types.ObjectId, photo): Promise<User> {
        return await this.userModel.findOneAndUpdate({id: id}, {photoAvatar: photo});
    }
}
