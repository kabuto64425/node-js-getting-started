const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const pg = require('pg');
const react = require('react');
const reactDOM = require('react-dom');
const PORT = process.env.PORT || 5000;

var pool = pg.Pool ({
  host: process.env.ENV_HOST,
  database: process.env.ENV_DATABASE,
  user: process.env.ENV_USER,
  port: 5432,
  password: process.env.ENV_PASSWORD,
});

/* ----- option ----- */
let txSp = 100; // テキストの表示速度
/* ----- option ----- */

let questionText;
let questionDisplayingTextCount = 0;

const PHASES = {
  READINGQUESTION : {
    name: 'readingQuestion',
    mainButtonText: 'Slash'
  },
  READTHROUGHQUESTION : {
    name: 'readThroughQuestion',
    mainButtonText: 'Slash'
  },
  STOPPINGQUESTION: {
    name: 'stoppingQuestion',
    mainButtonText: 'Slash'
  },
  INANSWER : {
    name: 'inAnswer',
    mainButtonText: 'Answer'
  },
  FULLVIEW : {
    name: 'fullView',
    mainButtonText: 'Next'
  }
};

let phase = {
  property: PHASES.READINGQUESTION
};

function watchValue(obj, propName, func) {
  let value = obj[propName];
  Object.defineProperty(obj, propName, {
      get: () => value,
      set: newValue => {
          const oldValue = value;
          value = newValue;
          func(oldValue, newValue);
      },
      configurable: true
  });
}

watchValue(phase, 'property', function(oldValue, newValue) {
  console.log(newValue);
});

io.on('connection', function (socket) {
  questionText = '物事が間近に迫っていることを、ある時間の単位を用いて「何読み」というでしょう？';

  function itimozi(postponement){ //　一文字ずつ表示させる
      
    if(postponement < 0) {
      phase.property = PHASES.INANSWER;
      return;
    }

    socket.emit('sending message', questionText.substr( 0, ++questionDisplayingTextCount )); // テキストの指定した数の間の要素を表示
    
    if(questionDisplayingTextCount < questionText.length){ // Count が初期の文字列の文字数と同じになるまでループ
      setTimeout(function() {
        if(phase.property == PHASES.STOPPINGQUESTION) {
          itimozi(--postponement);
        } else {
          itimozi(postponement);
        }
      }, txSp); // 次の文字へ進む*/
    } else {
      if(phase.property == PHASES.STOPPINGQUESTION) {
        phase.property = PHASES.INANSWER;
      } else {
        phase.property = PHASES.READTHROUGHQUESTION;
      }
    }
  };

  itimozi(2);

  socket.on('slash', function(msg) {
    if(phase.property == PHASES.READINGQUESTION) {
      phase.property = PHASES.STOPPINGQUESTION;
      return;
    }
    if(phase.property == PHASES.READTHROUGHQUESTION) {
      phase.property = PHASES.INANSWER;
      return;
    }
    if(phase.property == PHASES.INANSWER) {
      phase.property = PHASES.FULLVIEW;
      return;
    }
    if(phase.property == PHASES.FULLVIEW) {
      phase.property = PHASES.READINGQUESTION;
      return;
    }
  });
});

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function(req, res) {
    const data = {
      test: 'aaaaaaaaaaaaaaaaaaaaaaaa'
    };
    res.render('pages/index', data);
  })
  .get('/get', function(req, res) {
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
