import { Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class WordService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: PinoLogger
  ) { }

  async create(createWordDto: CreateWordDto) {
    return await this.prisma.mot.create({ data: createWordDto });
  }

  async findAll(keyword: string) {
    return await this.prisma.mot.findMany({
      where: {
        mot: keyword.toLowerCase()
      },
      include: {
        livre: true
      },
      orderBy: {
        nbOccurrences: 'desc'
      }
    });
  }

  async searchAdvanced() {
    return this.prisma.mot.findMany({
      select: {
        mot: true
      },
      distinct: ['mot']
    });
  }

  async searchMatchingWords(word: string) {
    return await this.prisma.mot.findMany({
      where: { mot: word },
      include: { livre: true }
    });
  }

  async findOne(id: number) {
    return this.prisma.mot.findUnique({ where: { id } });
  }

  async update(id: number, updateWordDto: UpdateWordDto) {
    return this.prisma.mot.update({
      where: { id },
      data: updateWordDto
    });
  }

  async remove(id: number) {
    return this.prisma.mot.delete({ where: { id } });
  }
}
