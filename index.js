const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dayjs = require('dayjs');

require('dotenv').config();
app.use(bodyParser.json());



app.use(bodyParser.json());
app.listen(3000, () => {
   console.log('App listening on port 3000');
})
