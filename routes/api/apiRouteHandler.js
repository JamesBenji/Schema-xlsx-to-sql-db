const route = require('express').Router();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');

route.use(bodyParser.json());

route.get('/getFileList', (req, res) => {
    try {
        const files = fs.readdirSync(path.join(__dirname, '..', '..', 'files', 'processed'));
        
        let count = 1;
        const fileJSON = files.map((file) => {
          return {
            name: file,
            id: count++,
          };
        });
    
        res.json(fileJSON); // Sending JSON data as the response
    
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' }); // Sending an error response
      }
}); 

route.post('/show_selected_file_db_records', (req, res) => {
  res.json(`DB for ${req.body.selected_file_name} is being built`)
});

route.post('/upload_xlsx', fileupload({ createParentPath: true }), 
    (req, res) => {
      
      const files = req.files;
      console.log(files)
      let successful_uploads =[]
      Object.keys(files).forEach(key => {
        const filePath = path.resolve(__dirname, `../../files/unprocessed/${files[key].name}`);

          files[key].mv(filePath, err => {
            if (err) return res.status(500).json({ status: err.status })
        })
        console.log(filePath)
        successful_uploads.push(path.basename(filePath));
      })

      res.json({successful_uploads: successful_uploads});


})



module.exports = route;