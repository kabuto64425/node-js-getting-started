'use strict';
/* ----- option ----- */
let txSp = 100; // テキストの表示速度
let dly = 1000; // 次の文章までの待ち時間
let postponement = 2; //ストップしてから文字を表示し続ける猶予文字
/* ----- option ----- */

/* ----- quiz ----- */
let quizzes;
/* ----- quiz ----- */

const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const mainButtonElement = document.getElementById('mainButton');

let questionText;
let answerText;

let questionDisplayingTextCount = 0;

let quizIndex = 0;

let xmlHttpRequest = new XMLHttpRequest();
xmlHttpRequest.onreadystatechange = function()
{
    if( this.readyState == 4 && this.status == 200 )
    {
        if( this.response )
        {
          // 読み込んだ後処理したい内容をかく
          quizzes = this.response
          kamikakushi(quizzes[quizIndex]);
          itimozi(postponement);
          quizIndex++;
        }
    }
}

xmlHttpRequest.open( 'GET', 'https://higasumi52-20200410.herokuapp.com/get', true );
xmlHttpRequest.responseType = 'json';
xmlHttpRequest.send( null );
 
function kamikakushi(quiz){ // 要素を変数に保持させ、非表示にする
  questionText = quiz.question;
  questionElement.textContent = '';

  answerText = quiz.answer;
  answerElement.textContent = '';
}

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

let phase = {
  property: PHASES.READINGQUESTION
};

watchValue(phase, 'property', function(oldValue, newValue) {
  mainButtonElement.textContent = newValue.mainButtonText;
});

//let phase = PHASES.READINGQUESTION;

let isStoped = false;

Array.from(document.getElementsByTagName("a")).forEach(element => {
  element.addEventListener("click", function(event) {
    event.preventDefault();
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
      questionElement.textContent = questionText;
      answerElement.textContent = answerText;
      return;
    }
    if(phase.property == PHASES.FULLVIEW) {
      phase.property = PHASES.READINGQUESTION;
      if(quizIndex >= quizzes.length) {
        quizIndex = 0;
      }

      kamikakushi(quizzes[quizIndex]);
      questionDisplayingTextCount = 0;
      itimozi(postponement);
      quizIndex++;
      return;
    }
  });
});

function itimozi(postponement){ //　一文字ずつ表示させる
  
  if(postponement < 0) {
    phase.property = PHASES.INANSWER;
    return;
  }
  
  questionElement.innerHTML = questionText.substr( 0, ++questionDisplayingTextCount ); // テキストの指定した数の間の要素を表示

  if(questionText.length != questionDisplayingTextCount){ // Count が初期の文字列の文字数と同じになるまでループ
    setTimeout(function() {
      if(phase.property == PHASES.STOPPINGQUESTION) {
        itimozi(--postponement);
      } else {
        itimozi(postponement);
      }
    }, txSp); // 次の文字へ進む
  } else {
    if(phase.property == PHASES.STOPPINGQUESTION) {
      phase.property = PHASES.INANSWER;
    } else {
      phase.property = PHASES.READTHROUGHQUESTION;
    }
  }
}