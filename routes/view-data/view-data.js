const route = require('express').Router();
const path = require('path');

route.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'view-data.html'));
});

route.get('/import_xlsx', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'import-xlsx.html'));
});


module.exports = route;