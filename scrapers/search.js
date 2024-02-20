const { PrismaClient } = require('@prisma/client');
const http = require('http');
const prisma = new PrismaClient();
async function getAllBooks() {
  books = await prisma.livre.findMany();
  return books;
  
}
getAllBooks();

