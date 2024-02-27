import { Controller, Get } from '@nestjs/common';
import { ScrapersService } from './scrapers.service';

@Controller('scrapers')
export class ScrapersController {
  constructor(private readonly scrapersService: ScrapersService) {}

  @Get('seedBooks')
  async seedBooks(): Promise<void> {
    this.scrapersService.seedBooks();
  }
}
