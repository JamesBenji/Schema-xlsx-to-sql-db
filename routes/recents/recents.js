const route = require('express').Router();
const path = require('path');

route.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'recents.html'));
});


module.exports = route;