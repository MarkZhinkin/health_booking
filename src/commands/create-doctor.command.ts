import { Command, CommandRunner } from "nest-commander";
import { DoctorSpecializationEnum } from "../commons/enums";
import { DoctorsService } from "../doctors/doctors.service";

@Command({
    name: "create-doctor",
    description: "Command to create a new doctor.",
    arguments: "<email> <password> <specialization>",
    options: { isDefault: false },
})
export class CreateDoctorCommand implements CommandRunner {
    constructor(
        private doctorsService: DoctorsService
    ) { }

    async run(inputs: string[], options: Record<string, any>): Promise<void> {
        if (inputs.length !== 3) {
            throw new Error(`not enough arguments. Expected 3, but given ${inputs.length}.`);
        }
        let [email, password, specialization] = inputs;
        specialization = specialization.toLocaleLowerCase();
        // @ts-ignore
        if (!Object.values(DoctorSpecializationEnum).includes(specialization)) {
            throw new Error(`invalid specialization type "${specialization}"`);
        }

        await this.doctorsService.createDoctor({email, password, specialization});
    }
}
