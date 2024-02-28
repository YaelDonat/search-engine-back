import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WordService } from './word.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('word')
@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) { }

  @Post()
  create(@Body() createWordDto: CreateWordDto) {
    return this.wordService.create(createWordDto);
  }
  @Post('search')
  async search(@Body('keyword') keyword: string) {
    const results = await this.wordService.findAll(keyword);
    const matchingBooks = results.map(result => ({
      title: result.livre.title,
      nbOccurrences: result.nbOccurrences,
      mot: result.mot,
      author: result.livre.author,
      imgUrl: result.livre.imgUrl
    }));

    return matchingBooks;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWordDto: UpdateWordDto) {
    return this.wordService.update(+id, updateWordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wordService.remove(+id);
  }

  @Post('search-advanced')
  async searchAdvanced(@Body() body: { regex: string }): Promise<any> {
    const { regex } = body;
    const regExp = new RegExp(regex, 'i');

    const allWords = await this.wordService.searchAdvanced();

    const filteredWords = allWords.filter(word => regExp.test(word.mot));

    const matchingBooks = [];
    for (const word of filteredWords) {
      const books = await this.wordService.searchMatchingWords(word.mot);
      books.forEach(book => {
        if (!matchingBooks.some(mb => mb.id === book.livre.id)) {
          matchingBooks.push({
            title: book.livre.title,
            occurrences: book.nbOccurrences,
            mot: word.mot,
            imgUrl: book.livre.imgUrl,
            author: book.livre.author
          });
        }
      });
    }

    return matchingBooks.sort((a, b) => b.occurrences - a.occurrences);
  }
}
