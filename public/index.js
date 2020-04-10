/* ----- option ----- */
var txSp = 100; // テキストの表示速度
var dly = 1000; // 次の文章までの待ち時間
var postponement = 2 //ストップしてから文字を表示し続ける猶予文字
/* ----- option ----- */

var questionElement = document.getElementById('question');
var answerElement = document.getElementById('answer');

var questionText;
var answerText;

var questionDisplayingTextCount = 0;

window.onload = function(){
  kamikakushi();
  itimozi(postponement);
}
 
function kamikakushi(){ // 要素を変数に保持させ、非表示にする
  questionText = questionElement.firstChild.nodeValue;
  questionElement.textContent = '';

  answerText = answerElement.firstChild.nodeValue;
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
  });
});

function itimozi(postponement){ //　一文字ずつ表示させる
  console.log(postponement);
  questionElement.innerHTML = questionText.substr( 0, ++questionDisplayingTextCount ); // テキストの指定した数の間の要素を表示

  if(postponement <= 0) {
    phase = PHASES.INANSWER;
    return;
  }

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