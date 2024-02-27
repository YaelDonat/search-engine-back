import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';
import { BookService } from 'src/book/book.service';

@Injectable()
export class ScrapersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: PinoLogger,
    private readonly bookService: BookService
  ) {}

  // BOOKS SCRAPING
  async createBooks(id: number) {
    try {
      const response = await fetch(`http://gutendex.com/books/${id}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch book data');
      }

      const bookData = await response.json();
      this.logger.info(bookData)

      const existingBook = await this.prisma.livre.findFirst({
        where: {
          OR: [{ title: bookData.title }, { bookid: bookData.id.toString() }]
        }
      });

      if (existingBook) {
        this.logger.info(`Le livre ${bookData.title} existe déjà dans la base de données.`);
        return null;
      }

      const createBookDto: CreateBookDto = {
        title: bookData.title,
        author: bookData.authors ? bookData.authors[0].name : 'Auteur inconnu',
        bookid: bookData.id.toString(),
        imgUrl: bookData.formats['image/jpeg']
      };

      await this.prisma.livre.create({
        data: createBookDto
      });

      this.logger.info(`Livre ${bookData.title} ajouté avec succès !`);
    } catch (error) {
      this.logger.error("Erreur lors de l'ajout du livre :", error);
    }
  }

  async scrapeandIndexBook(bookId: number) {
    try {
      // Scrape content
      const content = await this.scrapeTextContent(bookId);
      // Directly tokenize and index
      const index = await this.tokenizeAndIndex(content);
      // Save to DB in batch
      await this.saveIndexToDatabaseBatch(index, bookId);
      this.logger.info(`Indexation et sauvegarde du livre ${bookId} terminées.`);
    } catch (error) {
      this.logger.error("Erreur lors de l'indexation et de la sauvegarde :", error);
    }
  }

  async scrapeTextContent(id: number) {
    try {
      const response = await fetch(`https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch book content');
      }

      const content = await response.text(); // Attendre que la promesse se résolve et obtenir le contenu texte

      const startIndex =
        content.indexOf('*** START OF THE PROJECT GUTENBERG EBOOK') + '*** START OF THE PROJECT GUTENBERG EBOOK'.length;
      const titleEndIndex = content.indexOf('***', startIndex) + 3;
      const bookStartIndex = content.indexOf('\n', titleEndIndex) + 1;
      const bookContent = content.substring(bookStartIndex);

      return bookContent;
    } catch (error) {
      console.error('Erreur lors du téléchargement ou du traitement du texte :', error);
      throw error; // Vous pouvez choisir de relancer l'erreur ou de la gérer autrement
    }
  }

  async tokenizeAndIndex(text: string) {
    const words = text.toLowerCase().split(/\W+/);
    const index = {};
    words.forEach(word => {
      if (word) index[word] = (index[word] || 0) + 1;
    });
    return index;
  }

  async saveIndexToDatabaseBatch(index: object, bookid: number) {
    const livreId = await this.bookService.findBookId(bookid);
    if (!livreId) {
      console.error('Livre non trouvé pour bookid:', bookid);
      return;
    }

    const data = Object.entries(index).map(([mot, nbOccurrences]) => ({
      mot,
      nbOccurrences: Number(nbOccurrences),
      livreId
    }));

    await this.prisma.mot.createMany({
      data,
      skipDuplicates: true
    });
  }

  async seedBooks() {
    for (let i = 350; i < 361; i++) {
      await this.createBooks(i);
    }
    this.logger.info('Livres ajoutés avec succès !');
  }

  async addAndIndexBook(start: number, end: number) {
    for (let i = start; i < end; i++) {
      const result = await this.createBooks(i);
      if (result === null) {
        this.logger.info('book already exists');
        continue;
      }
      await this.scrapeandIndexBook(i);
    }

    this.logger.info('books added and indexed successfully');
  }
}
