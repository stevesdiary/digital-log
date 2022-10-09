const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dayjs = require('dayjs');
const mysql = require('mysql2');
// const { uuid } = require('uuidv4');
// const moment = require('moment');
// const { randomUUID } = require('crypto');
// const { timeStamp } = require('console');
// const { now } = require('moment');

require('dotenv').config();


const connection = mysql.createConnection({
   host: process.env.HOST,
   port: process.env.PORT,
   user: process.env.USERNAME,
   password: process.env.PASSWORD,
   database: process.env.DATABASE,
})

connection.connect((err) => {
   if(err)throw err;
      console.log("Connected to database!")
   })

app.use(bodyParser.json());

app.post('/entry', (req, res)=>{
   const data = req.body
   data.arrival = dayjs().format('YYYY-MM-DD HH:mm:ss')      //.format('YYYY-MM-DD hh:mm:ss')
   data.departure = dayjs().format('YYYY-MM-DD HH:mm:ss')   //.format('YYYY-MM-DD hh:mm:ss')

   // console.log(data)
   // const {
   //    arrival,
   //    departurev
   // } = data;

   const query = "INSERT INTO `visitors` (`firstName`, `lastName`, `gender`, `purpose`, `visited`, `arrival`, `departure`, `approvedBy`, `signatureCode`, `phone`) \
   VALUES ('"+ data.firstName +"', '"+ data.lastName+"', '"+ data.gender +"', '"+data.purpose+"', '"+data.visited+"', '"+data.arrival+"', '"+data.departure+"', '"+data.approvedBy+"', '"+data.signatureCode+"', '"+data.phone+"')"

   // const query = `INSERT INTO visitor (firstName, lastName, gender, purpose, visited, arrival, departure, approvedBy, signatureCode, phone) \
   // VALUES (${data.firstName}, ${data.lastName}, ${data.gender}, ${data.purpose}, ${data.visited}, ${data.arrival}, ${data.departure}, ${data.approvedBy}, ${data.signatureCode}, ${data.phone})`
   connection.query(
      query,
      function(error, result) {
         console.log(result, error)
         res.send(result != null ? 'Success! Data added to the database! ' : 'Failed to add entry to the database.  ' + error)
      }
   )
})
app.patch('/update', (req, res) => {
   const data = req.body
   // const payed = `SELECT , toRepay FROM loan WHERE id = '${id}'`
   data.departure = dayjs().format('YYYY-MM-DD HH:mm:ss') 
   const query = "UPDATE `visitors`\
   SET \
   gender = '"+ data.gender +"', \
   purpose = '"+ data.purpose +"', \
   departure = '"+data.departure+"', \
   approvedBy = '"+data.approvedBy+"' \
   WHERE id = '"+data.id+"'"
   connection.query(
      query,
      function (error, result) {
         console.error(error, result)
         res.send(result != null ? 'Update successful!' : 'An error occoured! '+ error)
      }
   );
})
app.get('/log', (req, res) => {
   const {body} =  req.body
   const query = "SELECT * FROM `visitors` WHERE `firstName` = '" + body + "'"
   connection.query(
      query,
      function (error, result) {
         console.log(result, error)
         res.send(result != null && result.length > 0 ? result: "Cannot find the query " + error)
      }
   );
})

//Fetch visitor by name
app.get('/search', (req, res) => {
   const {body} =  req.params
   console.log(req.params)
   const query = "SELECT * FROM `visitors` \
   WHERE `firstName` = '" + body + "'"  //' OR `lastName` = '" + body + "
   connection.query(
      query, 
      function (error, result) {
         console.log(result, error)
         res.send(result != null ? result: "Cannot find the query " + error)
      }
   );
})
// Search log by id
app.get('/:id', (req, res)=>{
   const { id } = req.params
   // console.log(req.params)
   const query = "SELECT * FROM `visitors` \
   WHERE `id` = '"+ id +"'"
      connection.query(
      query,
      function(error, result){
         console.log(result,  error)
         res.send(result != null ? result : 'Cannot process query. ' + error)
      }
   );
})

//Delete log by id(good)
app.delete('/delete/:id', (req, res)=>{
   const { id } = req.params
   console.log(req.params)
   const query = "DELETE FROM `visitors` WHERE `id` = '"+ id +"'"
      connection.query(
      query,
      function(error, result){
         console.log(result, error)
         res.send(result != null ? result : 'Cannot process query')
      }
   );
})


// Delete entry by ID (good)
app.delete('/:id', (req, res) => {
   const { id } = req.params

   const query = "DELETE FROM `visitors` WHERE `id` = '" + id + "'"
      connection.query(
         query, 
         function(error, result) { 
         console.log(result, error)
         res.send(result != null ? result : "Caanot process Query")
      }
   );
})

app.use(bodyParser.json());
app.listen(3000, () => console.log('App listening on port 3000'))
