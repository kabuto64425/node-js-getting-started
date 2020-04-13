/* ----- option ----- */
var txSp = 100; // テキストの表示速度
var dly = 1000; // 次の文章までの待ち時間
var postponement = 2; //ストップしてから文字を表示し続ける猶予文字
/* ----- option ----- */

/* ----- quiz ----- */
var quizzes;
/* ----- quiz ----- */

var questionElement = document.getElementById('question');
var answerElement = document.getElementById('answer');

var questionText;
var answerText;

var questionDisplayingTextCount = 0;

quizIndex = 0;

var xmlHttpRequest = new XMLHttpRequest();
xmlHttpRequest.onreadystatechange = function()
{
    if( this.readyState == 4 && this.status == 200 )
    {
        if( this.response )
        {
          console.log(this.response)
          // 読み込んだ後処理したい内容をかく
          quizzes = this.response
          console.log(quizzes)
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

var PHASES = {
    READINGQUESTION : 'readingQuestion',
    READTHROUGHQUESTION : 'readThroughQuestion',
    STOPPINGQUESTION: 'stoppingQuestion',
    INANSWER : 'inAnswer',
    FULLVIEW : 'fullView'
};

var phase = PHASES.READINGQUESTION;

var isStoped = false;

Array.from(document.getElementsByTagName("a")).forEach(element => {
  element.addEventListener("click", function(event) {
    event.preventDefault();
    if(phase == PHASES.READINGQUESTION) {
      phase = PHASES.STOPPINGQUESTION;
      return;
    }
    if(phase == PHASES.READTHROUGHQUESTION) {
      phase = PHASES.INANSWER;
      return;
    }
    if(phase == PHASES.INANSWER) {
      phase = PHASES.FULLVIEW;
      questionElement.textContent = questionText;
      answerElement.textContent = answerText;
      return;
    }
    if(phase == PHASES.FULLVIEW) {
      phase = PHASES.READINGQUESTION;
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
    phase = PHASES.INANSWER;
    return;
  }
  
  questionElement.innerHTML = questionText.substr( 0, ++questionDisplayingTextCount ); // テキストの指定した数の間の要素を表示

  if(questionText.length != questionDisplayingTextCount){ // Count が初期の文字列の文字数と同じになるまでループ
    setTimeout(function() {
      if(phase == PHASES.STOPPINGQUESTION) {
        itimozi(--postponement);
      } else {
        itimozi(postponement);
      }
    }, txSp); // 次の文字へ進む
  } else {
    if(phase == PHASES.STOPPINGQUESTION) {
      phase = PHASES.INANSWER;
    } else {
      phase = PHASES.READTHROUGHQUESTION;
    }
  }
}