import { PipeTransform, Injectable } from "@nestjs/common";
import { ValidationException } from "../exceptions/validation.exception";

@Injectable()
export class ImageValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File) {
        const imageAcceptableFormats: Array<string> = ["jpg", "png", "jpeg"];
        const imageMaxSize: number = 3000000;
        let errors = [];

        const fileFormat = file.originalname.split(".").slice(-1).pop();
        if (!imageAcceptableFormats.includes(fileFormat)) {
            errors.push(`image - waited ${Object.values(imageAcceptableFormats).join(", ")}, but given "${fileFormat}"`)
            
        }
        if (imageMaxSize < file.size) {
            errors.push(`image - max size must be not more ${imageMaxSize/1000000}Mb, but given ${Math.round(file.size/1000000)}Mb`)
        }

        if (errors.length) {
            throw new ValidationException(errors);
        }

        return file;
    }
}
