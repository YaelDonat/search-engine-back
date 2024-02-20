import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { of } from 'rxjs';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async getAllBooks() {
    return await prisma.livre.findMany();
    
  }
  async scrapeTextContent(id){
    try {
      const response = await axios.get(`https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`);
      const content = response.data;

      const startIndex = content.indexOf("*** START OF THE PROJECT GUTENBERG EBOOK") + "*** START OF THE PROJECT GUTENBERG EBOOK".length;
      const titleEndIndex = content.indexOf("***", startIndex) + 3; 
      const bookStartIndex = content.indexOf("\n", titleEndIndex) + 1; 
      const bookContent = content.substring(bookStartIndex);
      console.log(bookContent.substring(3000, 4000));
      return bookContent.substring(3000, 4000);
    } catch (error) {
      console.error("Erreur lors du téléchargement ou du traitement du texte :", error);
    }
  }
  }

 
