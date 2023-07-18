// require packages
const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

const PORT = 4000 || process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use('/', express.static(path.join(__dirname, 'public',)));
app.use('/routes', express.static(path.join(__dirname, 'public',)));
app.use('/workspace', express.static(path.join(__dirname, 'public',)));
app.use('/upload', express.static(path.join(__dirname, 'public',)));


// routes
app.use('^/$|(.html)?', require('./routes/views/view-login'))
app.use('/workspace', require('./routes/views/view-workspace'))
app.use('/api',require('./routes/api/apiRouteHandler'))



app.listen(PORT, () => console.log('listening on port',PORT));