import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RightsGuard implements CanActivate {

    constructor (private userType: string[]) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            if (!this.userType.includes(request.user.type)) {
                throw new UnauthorizedException({ message: "Not enough rights." });
            }
            return true;
        } catch (e) {
            throw new UnauthorizedException({ message: "Not enough rights." });
        }
    }
}
