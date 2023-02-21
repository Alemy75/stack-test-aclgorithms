const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('Показания.csv')
    .pipe(csv({
        separator: ';',
        mapHeaders: ({ header }) => header.replace('№','').trim().toLowerCase()
    }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log(results[0]);
    });

