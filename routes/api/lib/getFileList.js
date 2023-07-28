const fs = require('fs');
const path = require('path');
const getFileList = async (req, res, next) => {
    
        try {
            const files = fs.readdirSync(path.join(__dirname, '..', '..', '..', 'files', 'processed'));
            let count = 1;
            const fileJSON = files.map((file) => {
              return {
                name: file,
                id: count++,
              };

            });

            res.json(fileJSON); // Sending JSON data as the response
          } 
        catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' }); // Sending an error response
        }

    next();
};

module.exports = getFileList;