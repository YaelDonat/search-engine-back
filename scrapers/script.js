// Importing the required scripts
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const addBooks = require('./addbooks.js');
const indexAndSaveBook = require('./indexage.js');

async function main(debut, fin) {
    for (let i = debut; i < fin; i++) {
        await addBooks(i);
        await indexAndSaveBook(i);
    }
    
    console.log("books added and indexed successfully")
}
main(350, 361)
main(56667)