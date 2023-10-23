const express = require('express');
require('dotenv').config();
var app = express();
const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const connectionString = process.env.DATABASEURL;
const bodyParser = require('body-parser');

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

var userRoutes = require('./Routes/userRoutes');

mongoose.connect(connectionString)
.then(client => {
    console.log('Connected to database')
})
.catch(error=> console.error(error))



// app.use(express.json()); //either we use this or we can use body-parser
app.use(bodyParser.json());
app.use('/user', userRoutes);




// const http = require('http'); instead of express we can connect using HTTP 
// const server = http.createServer((req, res) => {
    //     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
//   });