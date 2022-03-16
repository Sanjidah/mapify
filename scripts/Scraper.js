const request = require('request');
const csv = require('csvtojson');

class Scraper {
  constructor() {
    this.countryRenameMapper = {
      USA: 'United States of America',
      UAE: 'United Arab Emirates',
      UK: 'United Kingdom',
      "Cote d'Ivoire": 'Ivory Coast',
      DRC: 'Democratic Republic of the Congo',
      Bahamas: 'The Bahamas',
    };
  }

  parseCSV(url) {
    return new Promise((resolve, reject) => {
      const rows = [];
      csv()
        .fromStream(request.get(url))
        .subscribe(
          (json) => {
            rows.push(json);
          },
          () => {
            reject();
          },
          () => {
            resolve(rows);
          }
        );
    });
  }
}

module.exports = Scraper;
