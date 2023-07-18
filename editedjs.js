// edit server.js.1

// app.post('/upload', fileUpload({ createParentPath: true }),
//     (req, res) => {
//         const files = req.files;
//         console.log(files);

//         Object.keys(files).forEach(key => {
//             const filepath = path.join(__dirname, 'files', files[key].name);

//             let errorLog = []
//             files[key].mv(filepath, (err) => {
//                 if (err){ 
//                     errorLog.push({ status: err, message: err });
//                 }
//             });

//             console.log(errorLog);

//             return res.json({ status: 'success', message: Object.keys(files).toString() });
//         })
//     }
// )