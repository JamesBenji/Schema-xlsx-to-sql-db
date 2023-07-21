const route = require('express').Router();
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const path = require('path');
const getXLSXData = require('./lib/getXLSXData')

route.use(bodyParser.json());

route.use('/getFileList', require('./lib/getFileList'));

route.post('/uploadXLSX', fileupload({ createParentPath: true }), 

(req, res) => {
  const files = req.files;
    console.log(files)
    console.log("SERVER LOG END")

    let successful_uploads =[]
    if(files){
      Object.keys(files).forEach(key => {
        const filePath = path.resolve(__dirname, `../../files/unprocessed/${files[key].name}`);
  
          files[key].mv(filePath, err => {
            if (err) return res.status(500).json({ status: err.status })
        });

        console.log(getXLSXData(filePath))
        successful_uploads.push(getXLSXData(filePath));
      })
  
      res.json({successful_uploads: successful_uploads});
    } else {
      res.status(400).send('No files were uploaded')
    }
  
});





module.exports = route;