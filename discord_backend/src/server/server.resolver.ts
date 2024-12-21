import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Server } from './types';
import { Request } from 'express';
import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { ServerService } from './server.service';
import { CreateServerDto } from './dto';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';

@Injectable()
@Resolver()
export class ServerResolver {
  constructor(private readonly serviceService: ServerService) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Server])
  async getServers(
    @Context() ctx: { req: Request },
    // @Context() context: any
  ) {
    // const profile = ctx;
    console.log('ctx', ctx);

    // if (!profile.email)
    //   return new BadRequestException('Profile not found!');

    // return this.serviceService.getServersByProfileEmailOfMember(
    // //   ctx.req?.profile.email,
    // profile.email
    // );
  }

  @Mutation(() => Server)
  async createServer(
    @Args('input') input: CreateServerDto,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: GraphQLUpload,
  ) {
    if (!file) {
       throw new BadRequestException('Server Image is required!')
    }
    const imageUrl = await this.storeImageAndGetUrl(file);
    return this.serviceService.createServer(input, imageUrl);
  }

  private async storeImageAndGetUrl(file: GraphQLUpload) {
    const { createReadStream, fileName } = await file;

    const uniqueFilename = `${uuidv4()}_${fileName}`;

    const imagePath = join(process.cwd(), 'public', 'images', uniqueFilename);
    const imageUrl = `${process.env.APP_URL}/images/${uniqueFilename}`;
    if(!existsSync(join(process.cwd(), 'public', 'images'))) {
        mkdirSync(join(process.cwd(), 'public', 'images'), { recursive: true });
    }

    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));
    return imageUrl;
  }
}
