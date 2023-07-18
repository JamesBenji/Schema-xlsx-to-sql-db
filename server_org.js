// require packages
const fs = require('fs');
const fsPromise = require('fs').promises;
const mysql = require('mysql2');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const fileExtLimiter = require('./middleware/fileExtLimiter')
const xlsx = require('xlsx');

// creating the application
const app = express();
const PORT = 4000 || process.env.PORT;


app.get('^/$|index(.html)?', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public','index.html'));
});

app.post('/workspace(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'workspace.html'));
})

app.post('/upload', fileUpload({ createParentPath: true }), 
    fileExtLimiter(['.xlsx']),
    (req, res) => {
        const files = req.files;
        console.log(files);

        const filePromises = Object.keys(files).map(key => {
            const filepath = path.join(__dirname, 'files', files[key].name);

            return new Promise((resolve, reject) => {
                files[key].mv(filepath, (err) => {
                    if (err) {
                        reject({ status: 'error', message: err });
                    } else {
                        resolve({ status: 'success', message: `${files[key].name} uploaded successfully` });
                    }
                });
            });
        });

        Promise.all(filePromises)
            .then(results => {
                console.log(results);
                res.json(results);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ status: 'error', message: 'Failed to upload files.' });
            });
    }
);

app.get('/system-files', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// // edit server.js.1

// app.use(express.static(path.join(__dirname, 'public')));

// const read_xlsx = (name) => {
//     // extracting the excel data
// const workbook = xlsx.readFile(path.join(__dirname, 'files', name));

// // READ WORKSHEET
// let worksheet = workbook.Sheets[workbook.SheetNames[0]];

// let range = worksheet['!ref']
// // console.log(typeof range)
// let str_arr = [...range]
// let limit = Number(str_arr[str_arr.length - 1])
// // console.log(typeof limit)

// // LOOP OVER WORKSHEET DATA
// let data = [];
// for (let index = 2; index < limit + 1 ; index++) {
//     const id = worksheet[`A${index}`].v;
//     const name = worksheet[`B${index}`].v;
//     const no = worksheet[`C${index}`].v;

//     console.log()

//     data.push({id: id, name: name, no:no});
// }

// console.log(data);
// }

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log('listening on port', PORT) );