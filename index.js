const express = require('express')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const pg = require('pg')
const PORT = process.env.PORT || 5000

var pool = pg.Pool ({
  host: process.env.ENV_HOST,
  database: process.env.ENV_DATABASE,
  user: process.env.ENV_USER,
  port: 5432,
  password: process.env.ENV_PASSWORD,
});

io.on('connection', function (socket) {
  socket.on('sending message', function (msg) {
    console.log('sending message')
  })
})

express()
  .use(express.static(path.join(__dirname, 'public')))
  .get('/get', function(req,res) {
    pool.connect(function(err, client, done) {
      if (err) {
        console.log(err)
      } else {
        client.query('select * from quiz_table order by random()', function (err, result) {
          done();
          res.json(result.rows)
        });
      }
    })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

/*express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))*/
