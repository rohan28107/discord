// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';

// @Injectable()
// export class GraphqlAuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext) {
//     const gqlCtx = context.getArgByIndex(2);
//     const request: Request = gqlCtx.req;
//     // Convert ExecutionContext to GqlExecutionContext
//     // const gqlContext = GqlExecutionContext.create(context);
//     // const request: Request = gqlContext.getContext().req;

//     const token = this.extractToken(request);

//     if (!token) throw new UnauthorizedException('Not Authorized!');

//     try {
//       const payload = await this.jwtService.verifyAsync(token, {
//         publicKey: process.env.JWT_PUBLIC_KEY,
//         algorithms: ['RS256'],
//       });
//       request['profile'] = payload;
//       // Attach the profile to the context
//       // gqlContext.getContext().profile = payload;
//     } catch (err) {
//       throw new UnauthorizedException('Not Authorized!', err);
//     }
//     return true;
//   }

//   private extractToken(request: Request): string | undefined {
//     return request.headers.authorization?.replace('Bearer ', '');
//   }
// }

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GraphqlAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService,) {}

  async canActivate(context: ExecutionContext) {
    const gqlCtx = context.getArgByIndex(2);
    const request: Request = gqlCtx.req;

    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('Not authorized!');

    try {
      // const payload = await this.jwtService.verifyAsync(token, {
      //   publicKey: process.env.JWT_PUBLIC_KEY,
      //   algorithms: ['RS256'],
      // });
      console.log('key', process.env.JWT_PUBLIC_KEY);
      const publicKey = this.configService.get<string>('JWT_PUBLIC_KEY');
      if (!publicKey) throw new Error('Public key is not defined in configuration.');

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_PUBLIC_KEY,
        algorithms: ['RS256'],
      });
      request['profile'] = payload;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Not authorized!', err);
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    return request.headers.authorization?.replace('Bearer ', '');
  }
}