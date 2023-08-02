const express = require('express')
const route = express.Router();
const path = require('path');



route.get('/workspace(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'workspace.html'));
})

route.get('/open-file', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages','open-file.html'));
})

route.get('/view-file/:filename', (req, res) => {
  const { filename } = req.params;
  res.render('view-file', { filename });
    // res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'file-view', 'view-file.html'));
})

route.get('/import-excel', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'import-excel.html'));
})
route.get('/export-to-csv', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'export-to-csv.html'));
})

// view-data route
route.get('/view-data', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'view-data.html'));
  });
  
route.get('/view-data/import_xlsx', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'pages', 'import-xlsx.html'));
  });

module.exports = route;