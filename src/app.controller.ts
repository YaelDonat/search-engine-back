import { Controller, Get, Query, Logger, Post, Body } from '@nestjs/common';
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


@Post('search-advanced')
async searchAdvanced(@Body() body: any): Promise<any> {
  const { regex } = body;
  const regExp = new RegExp(regex, 'i'); 

  const allWords = await prisma.mot.findMany({
    select: {
      mot: true,
    },
    distinct: ['mot'],
  });

  const filteredWords = allWords.filter(word => regExp.test(word.mot));

  const matchingBooks = [];
  for (const word of filteredWords) {
    const books = await prisma.mot.findMany({
      where: { mot: word.mot },
      include: { livre: true },
    });
    books.forEach(book => {
      if (!matchingBooks.some(mb => mb.id === book.livre.id)) {
        matchingBooks.push({ 
          title: book.livre.title, 
          occurrences: book.nbOccurrences,
          mot : word.mot
        });
      }
    });
  }

  return matchingBooks.sort((a, b) => b.occurrences - a.occurrences); 
}

}
