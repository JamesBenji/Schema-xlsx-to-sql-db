const express = require('express');
const route = express.Router();

route.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})


module.exports = route;