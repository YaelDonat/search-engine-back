const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

async function addBooks(id) {
    try {
        const response = await axios.get(`http://gutendex.com/books/${id}`);
        const bookData = response.data;

        await prisma.livre.create({
            data: {
                title: bookData.title,
                author: bookData.authors[0].name,
                bookid: bookData.id.toString(),}
            });
        console.log(`Livre ${bookData.title} ajouté avec succès !`);
    }
    catch (error) {
        console.error("Erreur lors de l'ajout du livre :");
    }
}
async function main() {
    for (let i = 360; i < 370; i++) {
        await addBooks(i);
    }
    console.log("books added successfully!")
}
main()