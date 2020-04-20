const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const pg = require('pg');
const PORT = process.env.PORT || 5000;

var pool = pg.Pool ({
  host: process.env.ENV_HOST,
  database: process.env.ENV_DATABASE,
  user: process.env.ENV_USER,
  port: 5432,
  password: process.env.ENV_PASSWORD,
});

let questionText;
let questionDisplayingTextCount = 0;

io.on('connection', function (socket) {
  socket.on('sending message', function (msg) {
    questionText = msg;

    function itimozi(postponement){ //　一文字ずつ表示させる
      
      io.emit('sending message', questionText.substr( 0, ++questionDisplayingTextCount )); // テキストの指定した数の間の要素を表示
    
      if(questionText.length != questionDisplayingTextCount){ // Count が初期の文字列の文字数と同じになるまでループ
        setTimeout(function() {
            itimozi(postponement);
        }, txSp); // 次の文字へ進む
      }
    };

    itimozi(2);

  });
});

app.use(express.static(path.join(__dirname, 'public')))
  .get('/get', function(req,res) {
    pool.connect(function(err, client, done) {
      if (err) {
        console.log(err);
      } else {
        client.query('select * from quiz_table order by random()', function (err, result) {
          done();
          res.json(result.rows);
        });
      }
    });
  });

http.listen(PORT, () => console.log(`Listening on ${ PORT }`));

/*express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))*/
