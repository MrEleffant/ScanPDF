const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    pipe: true,
    headless: true ,
  });

  let from = 220
  let maxChap = 500


  for (let chap = from; chap < maxChap; chap++) {
    
    const page = await browser.newPage();
    await page.goto('https://www.scan-vf.net/one_piece/chapitre-'+chap+'/1', {
      waitUntil: 'networkidle2',
    });

    const linkHandlers = await page.$x("//a[contains(text(), 'Mode de lecture')]");
    if (linkHandlers.length > 0) {
      await linkHandlers[0].click();
    } else {
      throw new Error("Link not found");
    }

    const fullPage = await page.$x("//a[contains(text(), 'Tout dans une page')]");
    if (fullPage.length > 0) {
      await fullPage[0].click();
    } else {
      throw new Error("Link not found");
    }

    setTimeout(async () => {
      await page.pdf({ path: 'OnePiece/one-piece-'+chap+'.pdf', height: '1920px',width: '1080px', displayHeaderFooter: false, printBackground: false});
      console.log('Chapitre ' + chap + ' OK')
      await page.close(); 

    }, 2000)
}
})();