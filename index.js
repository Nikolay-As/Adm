const express = require('express')
var axios = require('axios');
const app = express()
const port = 4000||process.env.port


var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000');


let chel=0;

const mysql = require("mysql2");
  
const pool = mysql.createPool({
    host: 'nikolayhs.beget.tech',
    user: 'nikolayhs_bot',
    database: 'nikolayhs_bot',
    password:'Nikolayhs_bot',
  });


// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = express.urlencoded({extended: false});

app.set("view engine", "ejs");

app.get('/check_views:id', (req, res) => {
    const sql='SELECT * FROM applications where id=?'
    pool.query(sql,[req.params.id], function(err, results) {
       // bot.telegram.sendMessage(id_kolya,'Заявка номер '+req.params.id)
        //bot.telegram.sendPhoto(id_kolya,results[0].file_id)
     socket.emit('check_views',[req.params.id,results[0].file_id])

  /*    
var data = JSON.stringify({
  "id": req.params.id,
  "file_id":results[0].file_id

});

var config = {
  method: 'post',
  url: 'http://localhost:3000/check_views',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  //console.log(error);
});

 */         
    
    });
    res.redirect('/application')
})

app.get('/processed:id', (req, res) => {
    let sql='SELECT * FROM applications where id=?'
    console.log('тут')
    pool.query(sql,[req.params.id], function(err, results) {
        //bot.telegram.sendMessage(results[0].id_user,'Заявка номер '+req.params.id+' обработана')

        socket.emit('processed',[req.params.id,results[0].id_user])
/*
        var data = JSON.stringify({
            "id": req.params.id,
           // "file_id":results[0].file_id,
            "id_user":results[0].id_user
          
          });
          
          var config = {
            method: 'post',
            url: 'http://localhost:3000/processed',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            //console.log(error);
          });
          */

        sql='UPDATE applications SET status=? WHERE id=?'
        pool.query(sql,[1,req.params.id],function(err,results){
            res.redirect('/application')
        })
    });
})
app.get('/error:id', (req, res) => {
    let sql='SELECT * FROM applications where id=?'
    pool.query(sql,[req.params.id], function(err, results) {
        //bot.telegram.sendMessage(results[0].id_user,'Заявка номер '+req.params.id+' не обработана(ошибка в заявке), напиши админу')
        socket.emit('error',[req.params.id,results[0].id_user])
        /*
        var data = JSON.stringify({
            "id": req.params.id,
            //"file_id":results[0].file_id,
            "id_user":results[0].id_user
          
          });
          
          var config = {
            method: 'post',
            url: 'http://localhost:3000/error',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            //console.log(error);
          });
          */

        sql='UPDATE applications SET status=? WHERE id=?'
        pool.query(sql,[3,req.params.id],function(err,results){
            res.redirect('/application')
        })
    });
})



app.get('/mac_processed:id', (req, res) => {
    let sql='SELECT * FROM applications where id=?'
    pool.query(sql,[req.params.id], function(err, results) {
        socket.emit('processed',[req.params.id,results[0].id_user])
        //bot.telegram.sendMessage(results[0].id_user,'Заявка номер '+req.params.id+' обработана')
        /*
        var data = JSON.stringify({
            "id": req.params.id,
            //"file_id":results[0].file_id,
            "id_user":results[0].id_user
          
          });
          
          var config = {
            method: 'post',
            url: 'http://localhost:3000/processed',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            //console.log(error);
          });

*/
        sql='UPDATE applications SET status=? WHERE id=?'
        pool.query(sql,[1,req.params.id],function(err,results){
            res.redirect('/mac_appl')
        })
    });
})

app.get('/mac_error:id', (req, res) => {
    let sql='SELECT * FROM applications where id=?'
    pool.query(sql,[req.params.id], function(err, results) {
        socket.emit('error',[req.params.id,results[0].id_user])
        /*
        var data = JSON.stringify({
            "id": req.params.id,
            //"file_id":results[0].file_id,
            "id_user":results[0].id_user
          
          });
          
          var config = {
            method: 'post',
            url: 'http://localhost:3000/error',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            //console.log(error);
          });

*/
        sql='UPDATE applications SET status=? WHERE id=?'
        pool.query(sql,[3,req.params.id],function(err,results){
            res.redirect('/mac_appl')
        })
    });
})



app.get('/', (req, res) => {
    res.render('main')
})

app.get('/application', (req, res) => {
    const sql='SELECT * FROM applications where status=? AND type=?'
    pool.query(sql,[2,'Оплата'], function(err, results) {
        res.render('appl',{result:results})
    });
})
app.post('/application',urlencodedParser, (req, res) => {
    
    const sql='SELECT * FROM applications where status=? AND type=?'
    pool.query(sql,[2,'Оплата'], function(err, results) {
        console.log(req.body)
        res.render('appl',{result:results})
    });
})


app.get('/mac_appl', (req, res) => {
    const sql='SELECT * FROM applications where status=? AND type=?'
    pool.query(sql,[2,'MAC'], function(err, results) {
        //for(let i=0;i<results.length;i++){
          //  console.log(results[i].comment)
            //let a=results[i].comment
            //a.replace(" ","+")
            //console.log("@"+a)
        //}
        res.render('mac_appl',{result:results})
    });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

