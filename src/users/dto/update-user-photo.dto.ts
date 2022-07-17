import { ApiProperty } from "@nestjs/swagger";
import { Express } from "express";

export const photoDescription =
    "A new avatar for the doctor. " +
    "Photo must be in the format .jpg, .jpeg or .png. " +
    "Photo size no more then 3 Mb. ";

export class UpdateUserPhotoDto {
    @ApiProperty({ type: "string", format: "binary", description: photoDescription  })
    file: Express.Multer.File;
}
