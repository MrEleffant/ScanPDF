const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    pipe: true,
    headless: true ,
  });

  let from = 1
  let maxChap = 2
  const url = 'https://www.scan-vf.net/one_piece/chapitre-'

  for (let chap = from; chap < maxChap; chap++) {
    let fullURL = url+chap+'/1'
    const page = await browser.newPage();
    await page.goto(fullURL, {
      waitUntil: 'networkidle2',
    });
    await wait(2000);
    
    const elem = await page.$(".img-responsive.scan-page");
    const boundingBox = await elem.boundingBox();
    console.log('boundingBox', boundingBox)
    
    await wait(2000);

    const linkHandlers = await page.$x("//a[contains(text(), 'Mode de lecture')]");
    if (linkHandlers.length > 0) {
      await linkHandlers[0].click();
    } else {
      console.log(fullURL)
      throw new Error("Mode de Lecture non trouvé " + fullURL);
    }

    const fullPage = await page.$x("//a[contains(text(), 'Tout dans une page')]");
    if (fullPage.length > 0) {
      await fullPage[0].click();
    } else {
      console.log(fullURL)
      throw new Error("Tout dans une page non trouvé" + fullURL);
    }

    setTimeout(async () => {
      await page.pdf({ path: 'PDFS/one-piece-'+chap+'.pdf', height: '1920px',width: '1080px', displayHeaderFooter: false, printBackground: false});
      console.log('Chapitre ' + chap + ' OK')
      await page.close(); 

    }, 2000)
}
})();

async function wait(ms){
  await setTimeout(async () => {
    return
  }, ms);
}