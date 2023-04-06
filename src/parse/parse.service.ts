import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'node-html-parser';
import * as path from 'path';

@Injectable()
export class ParseService {
  async getPlaylist(txtUrl: string) {
    try {
      const res = await fetch(txtUrl);
      const data = await res.json();

      return data.map((element) => {
        if (element.file.split(' or ')) {
          return {
            ...element,
            file: element.file.split(' or ')[0],
          };
        }

        return element;
      });
    } catch (error) {
      return null;
    }
  }

  async getParse() {
    const pages = 146;
    const books: any[] = [];
    let series;

    for (let i = 1; i <= pages; i++) {
      const res = await fetch(`https://knijy.com/genres/59?p=${i}`);
      const data = await res.text();

      Logger.log(`page ${i} in ${pages}`);
      const pageParse = await parse(data);
      const cart = pageParse.querySelectorAll('.media');

      for (let index = 0; index < cart.length; index++) {
        const mediaLeft = cart[index].querySelector('.media-left');
        const mediaBody = cart[index].querySelector('.media-body');

        const element = mediaLeft.querySelector('a');
        const imgEl = mediaLeft.querySelector('img');

        const author =
          mediaBody.querySelector('.row.book-series a').textContent;
        const reader =
          mediaBody.querySelector('.row.book-reader a')?.textContent;

        mediaBody.querySelectorAll('.row.book-series').forEach((item) => {
          const q = item.querySelector('b').textContent;

          if (q === 'Серия:') {
            const a = item.querySelector('a');

            const linkText = a.textContent;
            const numberBook = a.nextSibling.textContent.trim();

            series = linkText + ' ' + numberBook;
          }
        });

        const year = mediaBody.querySelector('.row.book-year a')?.textContent;
        const duration = mediaBody
          .querySelector('.row.book-duration .col-lg-12')
          ?.lastChild.textContent.trim();
        const description = mediaBody
          .querySelector('.description')
          .textContent.trim();

        const title = mediaBody.querySelector('a').firstChild.textContent;

        const href = element.getAttribute('href');
        const img = imgEl.getAttribute('data-original');
        const fileId = imgEl
          .getAttribute('data-original')
          .match(/[\d]+/gi)
          .at(-1);

        const playlist = await this.getPlaylist(
          href + `/playlist.txt?t=${fileId}`,
        );

        if (playlist) {
          books.push({
            title,
            img,
            playlist,
            author,
            reader,
            series,
            year,
            duration,
            description,
          });
        }
      }
    }

    const json = JSON.stringify({
      books,
    });

    fs.writeFile(
      path.join(__dirname, '..', '..', 'data', 'books.json'),
      json,
      function (err) {
        if (err) throw err;
        console.log('Saved!');
      },
    );
  }
}
