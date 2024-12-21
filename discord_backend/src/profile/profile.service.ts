import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}
  async createProfile(createProfileDto: CreateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        email: createProfileDto.email,
      },
    });
    if (profile) {
      return profile;
    }

    const res = this.prisma.profile.create({
      data: createProfileDto,
    });
    return res;
  }

  async getProfileById(id: number) {
    return this.prisma.profile.findUnique({
      where: {
        id,
      },
      include: {
        servers: {
          include: {
            channels: true,
          },
        },
      },
    });
  }

  async getProfileByEmail(email: string) {
    return this.prisma.profile.findUnique({
      where: {
        email,
      },
      include: {
        servers: {
          include: {
            channels: true,
          },
        },
      },
    });
  }
}
