import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "../database/models/users";
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersStatusEnum } from "../commons/enums";
import { ShowUserInfoResponse } from "./responses";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) {}

    async createUser(dto: {email: string, regToken: string}): Promise<User> {
        return await this.userModel.create(dto);
    }
    
    async getUserByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ email: email, status: { $ne: UsersStatusEnum.blocked }, include: { all: true } });
    }

    async getUserById(id: Types.ObjectId, isShowId: 0 | 1 = 0): Promise<User> {
        return await this.userModel.findById(id).select({
            _id: isShowId, email: 1, name: 1, phone: 1, photoAvatar: 1, status: 1 
        });
    }

    async updateUserInfoById(
            id: Types.ObjectId, 
            dto: { name?: string | undefined, phone?: string | undefined }
        ): Promise<ShowUserInfoResponse> {
        let user = await this.userModel.findOneAndUpdate(
            {id: id}, 
            {name: dto.name, phone: dto.phone}
        )
        if (dto.name) {
            user.name = dto.name;
        }
        if (dto.phone) {
            user.phone = dto.phone;
        }
        
        if (user.phone && user.name && user.status === "notСonfirmed") {
            await this.userModel.findOneAndUpdate(
                {id: id}, 
                {status: "active"}
            )
            user.status = "active";
        }

        return {
           email: user.email, name: user.name, phone: user.phone, photoAvatar: user.photoAvatar, status: user.status 
        };
    }

    async updateUserPhotoById(id: Types.ObjectId, photo: string) {
        await this.userModel.findOneAndUpdate({id: id}, {photoAvatar: photo});
    }
}
