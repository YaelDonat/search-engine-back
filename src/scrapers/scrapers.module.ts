import { Module } from '@nestjs/common';
import { ScrapersService } from './scrapers.service';
import { ScrapersController } from './scrapers.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ScrapersController],
  providers: [ScrapersService, PrismaService]
})
export class ScrapersModule { }
