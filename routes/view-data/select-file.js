const route = require('express').Router();
const path = require('path');

route.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'view-data.html'));
});

route.post('/select-file', (req, res) => {
  res.send('select file')
    // 
});


module.exports = route;