const puppeteer = require('puppeteer');
const axios = require('axios');

//peut être retirer scrapeBookDetails plus tard et l'import de puppeteer
async function scrapeBookDetails(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const bookDetails = await page.evaluate(() => {
    let title = '';
    let author = '';
    const rows = document.querySelectorAll('.bibrec tr');
    rows.forEach(row => {
      const thText = row.querySelector('th') ? row.querySelector('th').innerText : '';
      const tdText = row.querySelector('td') ? row.querySelector('td').innerText : '';

      if (thText === 'Author') {
        author = tdText;
      } else if (thText === 'Title') {
        title = tdText;
      }
    });

    return { title, author };
  });

  console.log(bookDetails);
  await browser.close();
}

module.exports = {
  scrapeTextContent: async function(id) { 
    try {
      const response = await axios.get(`https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`);
      const content = response.data;

      const startIndex = content.indexOf("*** START OF THE PROJECT GUTENBERG EBOOK") + "*** START OF THE PROJECT GUTENBERG EBOOK".length;
      const titleEndIndex = content.indexOf("***", startIndex) + 3; 
      const bookStartIndex = content.indexOf("\n", titleEndIndex) + 1; 
      const bookContent = content.substring(bookStartIndex);
      console.log(bookContent.substring(3000, 4000)); 
      return bookContent;
    } catch (error) {
      console.error("Erreur lors du téléchargement ou du traitement du texte :", error);
    }
  }

  }