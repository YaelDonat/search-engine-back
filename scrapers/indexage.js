const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scrapeTextContent(id) { 
    try {
      const response = await axios.get(`https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`);
      const content = response.data;

      const startIndex = content.indexOf("*** START OF THE PROJECT GUTENBERG EBOOK") + "*** START OF THE PROJECT GUTENBERG EBOOK".length;
      const titleEndIndex = content.indexOf("***", startIndex) + 3; 
      const bookStartIndex = content.indexOf("\n", titleEndIndex) + 1; 
      const bookContent = content.substring(bookStartIndex);
      
      return bookContent;
    } catch (error) {
      console.error("Erreur lors du téléchargement ou du traitement du texte :", error);
    }
  }

  async function tokenize(text){
   
    let words = text.split(/\W+/)
        .filter(token => token)
        .map(token => token.toLowerCase()); 

    return words
}
tokenize("Hello, world! This is a test. test hello")
async function indexage(id){
    let chaine = await scrapeTextContent(id); // Supposons que cela récupère une chaîne de texte
    let words = await tokenize(chaine); // Supposons que cela divise la chaîne en mots
    let index = {};
    for(let i = 0; i < words.length; i++){
        
        let word = words[i];
        if(index[word]){
            index[word]++;
        } else {
            index[word] = 1;
        }
    }
    return index;
}


async function findLivreIdByBookid(bookid) {
  const livre = await prisma.livre.findUnique({
    where: {
      bookid: bookid.toString(),
    },
  });
  return livre ? livre.id : null;
}

async function saveIndexToDatabase(index, bookid) {
    const livreId = await findLivreIdByBookid(bookid);
    if (!livreId) {
      console.error("Livre non trouvé pour bookid:", bookid);
      return;
    }
  
    for (const [mot, nbOccurrences] of Object.entries(index)) {
      const existingEntry = await prisma.mot.findFirst({
        where: {
          mot: mot,
          livreId: livreId,
        },
      });
      if (!existingEntry) {
        await prisma.mot.create({
          data: {
            mot: mot,
            nbOccurrences: nbOccurrences,
            livreId: livreId,
          },
        });
      }
    }
  }
  

async function indexAndSaveBook(bookid) {
    
    const index = await indexage(bookid); 
    await saveIndexToDatabase(index, bookid);
    console.log(`Indexation et sauvegarde du livre ${bookid} terminées.`);
  }


module.exports = indexAndSaveBook;