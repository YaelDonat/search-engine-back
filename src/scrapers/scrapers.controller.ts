import { Controller, Get, Param, Post } from '@nestjs/common';
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
  async addAndIndexBook(@Param('start') start: number, @Param('end') end: number): Promise<void> {
    this.scrapersService.addAndIndexBook(start, end);
  }
}
