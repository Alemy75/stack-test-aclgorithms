const csv = require('csv-parser')
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let results = [];
let records = [];

// Чтение файла Показания.csv
fs.createReadStream('Показания.csv')
    .pipe(csv({
        separator: ';',

        // Создание заголовков
        headers: [
            'id', 'street', 'house', 'flat', 'april', 'may', 'june'
        ]
    }))
    .on('data', (data) => results.push(data))
    .on('end', () => {

        // Удаление из массива элемента с заголовками
        results = results.filter(el => el.street !== 'Улица')

        // Перебор полученного массива обьектов
        for (let i = 0; i < results.length; i++) {

            // Создание обьекта для записи
            records.push(
                {
                    id: results[i].id,
                    street: results[i].street,
                    house: results[i].house,
                    flat: results[i].flat,
                    april: results[i].april,
                    may: results[i].may,
                    june: results[i].june,
                    aprilToMay: results[i].may - results[i].april,
                    mayToJune: results[i].june - results[i].may,
                    isTrue: ''
                }
            )
        }

        const csvWriter = createCsvWriter({
            path: 'Рассчеты.csv',
            header: [
                {id: 'id', title: '№ строки'},
                {id: 'street', title: 'Улица'},
                {id: 'house', title: '№ дома'},
                {id: 'flat', title: '№ квартиры'},
                {id: 'april', title: 'Апрель'},
                {id: 'may', title: 'Май'},
                {id: 'june', title: 'Июнь'},
                {id: 'aprilToMay', title: 'Апрель-Май'},
                {id: 'mayToJune', title: 'Май-июнь'},
                {id: 'isTrue', title: 'Верны ли показатели'},
            ],
            fieldDelimiter: ';',
            encoding: "UTF-8"
        });



        csvWriter.writeRecords(records)
            .then(() => {
                console.log('Сумма за периоды рассчитана и записана в файл Рассчеты.csv');
            });
    });

