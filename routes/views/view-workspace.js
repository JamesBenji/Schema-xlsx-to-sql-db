const express = require('express')
const route = express.Router();
const path = require('path');

route.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'workspace.html'));
})

// view-data route
route.use('/view-data', require('../view-data/view-data.js'));
// how-to-use route
route.use('/how-to-use', require('../how-to-use/how-to-use.js'));
// recents route
route.use('/recents', require('../recents/recents.js'));

module.exports = route;