import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ScrapersService } from './scrapers.service';
import { Params } from 'nestjs-pino';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Scrapers')
@Controller('scrapers')
export class ScrapersController {
  constructor(private readonly scrapersService: ScrapersService) {}

  @Get('seedBooks')
  async seedBooks(): Promise<void> {
    this.scrapersService.seedBooks();
  }

  @Post('addAndIndexBook')
  async addAndIndexBook(@Body() body ): Promise<void> {
    const { start, end } = body;
    this.scrapersService.addAndIndexBook(start,end);
  }
}

