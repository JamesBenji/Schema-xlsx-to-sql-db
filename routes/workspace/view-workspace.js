const express = require('express')
const route = express.Router();
const path = require('path');

route.get('/workspace(.html)?', (req, res) => {
    console.log("here in workspace")
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'workspace.html'));
})

// view-data route
route.get('/view-data', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'view-data.html'));
  });
  
  route.get('/view-data/import_xlsx', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'import-xlsx.html'));
  });

module.exports = route;