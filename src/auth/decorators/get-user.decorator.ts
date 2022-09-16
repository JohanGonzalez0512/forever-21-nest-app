import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new InternalServerErrorException('No user found (request)');
        }

        return (!data) ? user : user[data];
    }
)