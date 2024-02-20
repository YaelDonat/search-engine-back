import { Controller, Get, Query, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Post('search')
  async search(@Query('keyword') keyword: string) : Promise<any> {
    
    const books = await this.appService.getAllBooks();
    const matchingBooks: string[] = [];
    const booktable = {};
    for (const book of books) {
      const textContent = await this.appService.scrapeTextContent(book.bookid);
      const regex = new RegExp('\\b' + keyword + '\\b', 'i');
      if (regex.test(textContent)) {
        matchingBooks.push(book.title);
    }
  }
    return matchingBooks;

  
}
}
