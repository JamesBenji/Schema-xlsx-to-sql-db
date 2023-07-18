const route = require('express').Router();
const path = require('path');

route.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'how-to-use.html'));
});


module.exports = route;