// require packages
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = 4000 || process.env.PORT;
const cors = require('cors');
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use('/', express.static(path.join(__dirname, 'public',)));
app.use('/routes', express.static(path.join(__dirname, 'public',)));
app.use('/workspace', express.static(path.join(__dirname, 'public',)));
app.use('/upload', express.static(path.join(__dirname, 'public',)));


// routes
app.get('^/$|index(.html)?', (req, res) => {
    console.log('here in root')
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.use('/workspace', require('./routes/workspace/view-workspace'))
app.use('/api', require('./routes/api/apiRequest'))

app.listen(PORT, () => console.log('listening on port',PORT));