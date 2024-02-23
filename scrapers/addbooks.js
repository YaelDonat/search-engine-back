const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addBooks(id) {
    try {
        const response = await axios.get(`http://gutendex.com/books/${id}`);
        const bookData = response.data;

        const existingBook = await prisma.livre.findFirst({
            where: {
                OR: [
                    { title: bookData.title },
                    { bookid: bookData.id.toString() }
                ]
            }
        });

        if (existingBook) {
            console.log(`Le livre ${bookData.title} existe déjà dans la base de données.`);
            return; 
        }
        await prisma.livre.create({
            data: {
                title: bookData.title,
                author: bookData.authors.length > 0 ? bookData.authors[0].name : 'Auteur inconnu',
                bookid: bookData.id.toString(),
                imgUrl: bookData.formats['image/jpeg'],
            }
        });
        console.log(`Livre ${bookData.title} ajouté avec succès !`);
    }
    catch (error) {
        console.error("Erreur lors de l'ajout du livre :", error);
    }
}

async function main() {
    for (let i = 350; i < 361; i++) {
        await addBooks(i);
    }
    console.log("books added successfully!")
}
main()