import { Module } from '@nestjs/common';
import { ScrapersService } from './scrapers.service';
import { ScrapersController } from './scrapers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookService } from 'src/book/book.service';

@Module({
  controllers: [ScrapersController],
  providers: [ScrapersService, PrismaService, BookService]
})
export class ScrapersModule {}
