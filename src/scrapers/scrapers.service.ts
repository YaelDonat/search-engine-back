import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScrapersService {
  constructor(private prisma: PrismaService) { }

  // BOOKS 
  async createBooks(id: number) {
    try {
      const response = await fetch(`http://gutendex.com/books/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch book data');
      }

      const bookData = await response.json();
      console.log(bookData);

      const existingBook = await this.prisma.livre.findFirst({
        where: {
          OR: [{ title: bookData.title }, { bookid: bookData.id.toString() }],
        },
      });

      if (existingBook) {
        console.log(`Le livre ${bookData.title} existe déjà dans la base de données.`);
        return null;
      }

      const createBookDto: CreateBookDto = {
        title: bookData.title,
        author: bookData.authors ? bookData.authors[0].name : 'Auteur inconnu',
        bookid: bookData.id.toString(),
        imgUrl: bookData.formats['image/jpeg'],
      };

      await this.prisma.livre.create({
        data: createBookDto,
      });

      console.log(`Livre ${bookData.title} ajouté avec succès !`);
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre :", error);
    }
  }


  async seedBooks() {
    for (let i = 350; i < 361; i++) {
      await this.createBooks(i);
    }
    console.log('books added successfully!');
  }
}
