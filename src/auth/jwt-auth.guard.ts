import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            const authHeader = request.headers.authorization;
            const [_type, token] = authHeader.split(" ");

            if (_type !== "Bearer" || !token) {
                throw new UnauthorizedException({ message: "Forboden. User unauthorized." });
            }

            const user = this.jwtService.verify(token);
            request.userId = user.id;

            return true;
        } catch (e) {
            throw new UnauthorizedException({ message: "Forboden. User unauthorized." });
        }
    }
}
