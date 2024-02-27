const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scrapeAndIndexBook(bookid) {
  try {
    // Scrape content
    const content = await scrapeTextContent(bookid);
    // Directly tokenize and index
    const index = tokenizeAndIndex(content);
    // Save to DB in batch
    await saveIndexToDatabaseBatch(index, bookid);
    console.log(`Indexation et sauvegarde du livre ${bookid} terminées.`);
  } catch (error) {
    console.error("Erreur lors de l'indexation et de la sauvegarde :", error);
  }
}

async function scrapeTextContent(id) {
  try {
    const response = await axios.get(`https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`);
    const content = response.data;

    const startIndex =
      content.indexOf('*** START OF THE PROJECT GUTENBERG EBOOK') + '*** START OF THE PROJECT GUTENBERG EBOOK'.length;
    const titleEndIndex = content.indexOf('***', startIndex) + 3;
    const bookStartIndex = content.indexOf('\n', titleEndIndex) + 1;
    const bookContent = content.substring(bookStartIndex);

    return bookContent;
  } catch (error) {
    console.error('Erreur lors du téléchargement ou du traitement du texte :', error);
  }
}

function tokenizeAndIndex(text) {
  const words = text.toLowerCase().split(/\W+/);
  const index = {};
  words.forEach(word => {
    if (word) index[word] = (index[word] || 0) + 1;
  });
  return index;
}

async function saveIndexToDatabaseBatch(index, bookid) {
  const livreId = await findLivreIdByBookid(bookid);
  if (!livreId) {
    console.error('Livre non trouvé pour bookid:', bookid);
    return;
  }

  const data = Object.entries(index).map(([mot, nbOccurrences]) => ({
    mot,
    nbOccurrences,
    livreId,
  }));

  await prisma.mot.createMany({
    data,
    skipDuplicates: true,
  });
}

async function findLivreIdByBookid(bookid) {
  const livre = await prisma.livre.findUnique({
    where: {
      bookid: bookid.toString(),
    },
  });
  return livre ? livre.id : null;
}

module.exports = scrapeAndIndexBook;
