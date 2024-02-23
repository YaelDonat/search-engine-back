import { Controller, Get, Query, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Post('search')
async search(@Query('keyword') keyword: string): Promise<any> {
  
  const results = await prisma.mot.findMany({
    where: {
      mot: keyword.toLowerCase(), 
    },
    include: {
      livre: true, 
    },
    orderBy: {
      nbOccurrences: 'desc',
    },
  });

  const matchingBooks = results.map(result => ({
    title: result.livre.title,
    nbOccurrences: result.nbOccurrences,
  }));

  return matchingBooks;
}

}
