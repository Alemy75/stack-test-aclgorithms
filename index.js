const csv = require('csv-parser'); // Для чтения .csv
const fs = require('fs'); // Для работы с файловой системой
const createCsvWriter = require('csv-writer').createObjectCsvWriter; // Для записи .csv

let results = []; // Массив для записи прочтенного файла  
let records = []; // Массив с новыми рассчетами, обьект для записи
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
        results = results.filter(el => el.street !== 'Улица');

        // Перебор полученного массива обьектов
        for (let i = 0; i < results.length; i++) {
    
            // Заполнение массива для записи
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
                    isTrue: '-'
                }
            )
        }

        // Опрделение верности показателей
        for (let i = 0; i < results.length; i++) {

            // Нахождение показателя дома
            if (records[i].flat == 0 ) {

                // Переменные для суммы показателей квартир дома
                let aprilToMayOfFlat = 0;
                let mayToJuneOfFlat = 0;

                // Создание обьекта с информацией о доме
                let houseData = {
                    street: records[i].street,
                    house: records[i].house,
                    aprilToMay: records[i].aprilToMay,
                    mayToJune: records[i].mayToJune
                }

                // Получение сумм показателей квартир дома
                for (let j = 0; j < results.length; j++) {
                    if (records[j].street === houseData.street && records[j].house === houseData.house && records[j].flat !== '0') {
                        aprilToMayOfFlat = aprilToMayOfFlat + records[j].aprilToMay
                        mayToJuneOfFlat = mayToJuneOfFlat + records[j].mayToJune
                    }
                }

                // Проверка равенства показателей
                console.log(aprilToMayOfFlat, mayToJuneOfFlat, records[i].aprilToMay, records[i].mayToJune)
                if (aprilToMayOfFlat == records[i].aprilToMay && mayToJuneOfFlat == records[i].mayToJune) {
                    records[i].isTrue = 'Верны'
                } else {
                    records[i].isTrue = 'Не верны'
                }          
            }
        }

        // Запись .csv 
        const csvWriter = createCsvWriter({
            path: 'Рассчеты.csv',
            
            // Создание заголовков
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

            // Кодировка (У меня почему то она не срабатывает в открытии файла в Excel, но если открыть файл через вкладку Данные, показывается верно)
            encoding: "UTF-8"
        });


        // Отчет о записи
        csvWriter.writeRecords(records)
            .then(() => {
                console.log('Сумма за периоды рассчитана и записана в файл Рассчеты.csv');
            });
    });

