const express = require('express');
const PouchDB = require('pouchdb');
const path = require('path');

const db = PouchDB.defaults({prefix: path.join(__dirname, 'dbs/')})

const app = express();
const port = 3000;

app.listen(port, () => console.log(`listening on port ${port}`));

app.use('/', express.static(path.join(__dirname, 'static')));
app.use('/db', require('express-pouchdb')(db));
