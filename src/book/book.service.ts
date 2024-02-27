import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class BookService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: PinoLogger
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const livre = await this.prisma.livre.create({
        data: {
          title: createBookDto.title,
          author: createBookDto.author,
          bookid: createBookDto.bookid,
          imgUrl: createBookDto.imgUrl
        }
      });

      if (createBookDto.mots && createBookDto.mots.length > 0) {
        for (const wordDto of createBookDto.mots) {
          await this.prisma.mot.create({
            data: {
              mot: wordDto.mot,
              nbOccurrences: wordDto.nbOccurrences,
              livreId: livre.id
            }
          });
        }
      }

      this.logger.info(`Livre ${livre.title} ajouté avec succès !`);
      return livre;
    } catch (error) {
      this.logger.error("Erreur lors de l'ajout du livre :", error);
      throw error;
    }
  }

  findAll() {
    return this.prisma.livre.findMany();
  }

  findOne(id: number) {
    return this.prisma.livre.findUnique({ where: { id } });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    try {
      const existingBook = await this.prisma.livre.findUnique({
        where: { id }
      });

      if (!existingBook) {
        throw new Error(`Le livre avec l'ID ${id} n'existe pas.`);
      }

      const updatedBook = await this.prisma.livre.update({
        where: { id },
        data: {
          title: updateBookDto.title,
          author: updateBookDto.author,
          bookid: updateBookDto.bookid,
          imgUrl: updateBookDto.imgUrl
        }
      });

      this.logger.info(`Livre ${updatedBook.title} mis à jour avec succès !`);
      return updatedBook;
    } catch (error) {
      this.logger.error('Erreur lors de la mise à jour du livre :', error);
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.livre.delete({ where: { id } });
  }

  async findBookId(bookId: number) {
    const book = await this.prisma.livre.findUnique({
      where: {
        bookid: bookId.toString()
      }
    });
    return book ? book.id : null;
  }
}
