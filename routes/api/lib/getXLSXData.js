const xlsx = require('xlsx');

const getXLSXData = (xlsx_file_path) => {
    const letters = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));
    let firstLetter, firstNumber, secondLetter, secondNumber;
    let slicedLetters

    const workbook = xlsx.readFile(xlsx_file_path);
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let xlsxrange = worksheet['!ref']

    const text = xlsxrange;
    const regex = /^([A-Za-z])(\d+):([A-Za-z])(\d+)$/;
    const match = text.match(regex);

    if (match) {
    firstLetter = match[1];
    firstNumber = parseInt(match[2]);
    secondLetter = match[3];
    secondNumber = parseInt(match[4]);

    } else {
    console.log('No match found.');
    }

    let range = secondNumber - firstNumber;

    const startIndex = letters.indexOf(firstLetter); 
    const endIndex = letters.indexOf(secondLetter); 

    if (startIndex !== -1 && endIndex !== -1) {
    slicedLetters = letters.slice(startIndex, endIndex + 1);
    console.log(slicedLetters);
    //   [ 'A', 'B', 'C', 'D' ]
    } else {
    console.log('Invalid starting or ending letter.');
    }

    const generateColArr = (worksheet, slicedLetters, firstNumber, secondNumber) => {
        let dynamicArrforCol = [];
        slicedLetters.forEach(letter => {

            let temp_arr = [];
            for (let i = firstNumber; i < secondNumber + 1; i++){
                temp_arr.push(worksheet[`${letter}${i}`].v);
            }
            let key = "ArrayFor" + letter;
            let arr_obj = {[key]: temp_arr};
            dynamicArrforCol.push(arr_obj);
            temp_arr = [];
        // console.log("Array for ", letter, "made")
    })

        return dynamicArrforCol
    };

    const getFinalData = (dynamicArrforCol) => {
        let dataRow = [];
        let col_length = dynamicArrforCol.length;
        let length = dynamicArrforCol[0][`${Object.keys(dynamicArrforCol[0])[0]}`].length;
        let dataKeyArray = [];

        dynamicArrforCol.forEach(obj => {
            const [key] = Object.keys(obj);
            dataKeyArray.push(key);
        });
        // console.log('dataArr_keys : ')
        // console.log(dataKeyArray)
        // [ArrayForA, ArrayForB, ArrayForC, ArrayForD]
        // length of each data array
        console.log('length : ',length)

        let object_keys = []
        dynamicArrforCol.forEach( obj => {
            const key = obj[`${Object.keys(obj)[0]}`][0];
            object_keys.push(key);
        });

        console.log('object_keys : ')
        console.log(object_keys)
        // [ 'ID', 'NAME', 'NO', 'TEST' ]

        // creating n objects using data from 3 arrays
        for (let i = 1; i < length; i++) {
            let resObj = {};

            for (let colID = 0; colID < col_length; colID++) {
                resObj[object_keys[colID]] = dynamicArrforCol[colID][`${dataKeyArray[colID]}`][i];
            }
            dataRow.push(resObj);
        }

        return dataRow;
    }
    return getFinalData(generateColArr(worksheet, slicedLetters, firstNumber, secondNumber))

}
module.exports = getXLSXData