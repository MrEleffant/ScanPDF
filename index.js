const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    pipe: true,
    headless: true,
  });

  let fromChap = 51
  let toChap = 100
  const manga = 'kimetsu-no-yaiba'

  const url = 'https://www.scan-vf.net/' + manga + '/chapitre-'

  for (let chap = fromChap; chap < toChap + 1; chap++) {
    let fullURL = url + chap + '/1'
    try {
      // console.log(fullURL)
      let fullUrlPage2 = url + chap + '/4'
      // console.log(fullUrlPage2)

      const page = await browser.newPage();

      await page.goto(fullUrlPage2, {
        waitUntil: 'networkidle2',
      });
      await wait(1000)
      const elem = await page.$(".img-responsive.scan-page");
      const boundingBox = await elem.boundingBox();
      // console.log('boundingBox', boundingBox)

      await page.goto(fullURL, {
        waitUntil: 'networkidle2',
      });


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

      await autoScroll(page);

      setTimeout(async () => {
        await page.pdf({ path: 'PDFS/' + manga + '-' + chap + '.pdf', height: (1.1 * boundingBox.height) + 'px', width: (1.1 * boundingBox.width) + 'px', displayHeaderFooter: false, printBackground: false });

        // await page.screenshot({
        //   path: 'PDFS/one-piece-'+chap+'.png',
        //   fullPage: true
        // });

        console.log(`Chapitre ${chap} téléchargé - ${boundingBox.height} x ${boundingBox.width}`)
        await wait(2000);
        await page.close();

      }, 2000)

    } catch (error) {
      console.log(fullURL)
      console.log(error)
    }


  }
})();

async function wait(ms) {
  await setTimeout(async () => {
    return
  }, ms);
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });
}