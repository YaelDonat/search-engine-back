import { Controller, Get, Post, Query } from '@nestjs/common';
import { ScrapersService } from './scrapers.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('scrapers')
@Controller('scrapers')
export class ScrapersController {
  constructor(private readonly scrapersService: ScrapersService) {}

  @Get('seedBooks')
  async seedBooks(): Promise<void> {
    this.scrapersService.seedBooks();
  }

  @Post('addAndIndexBook')
  async addAndIndexBook(@Query('start') start: number, @Query('end') end: number): Promise<void> {
    this.scrapersService.addAndIndexBook(start, end);
  }
}
