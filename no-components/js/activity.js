// timeout event handler
var timer = null;

var tenthsOfSecond = 0;
var seconds = 0;
var minutes = 0;

var stepMiliseconds = 100;

function drawTime() {
  var counter = document.getElementById('counter');
  counter.innerHTML = minutes + ':' + seconds + '.' + tenthsOfSecond;
}

function chronometer() {
  tenthsOfSecond += 1;
  if (tenthsOfSecond == 10) {
    tenthsOfSecond = 0;
    seconds += 1;
  }
  if (seconds == 60) {
    seconds = 0;
    minutes += 1;
  }

  drawTime();

  // call this function again in 100 miliseconds
  timer = setTimeout("chronometer()", stepMiliseconds);
}

var startButton = document.getElementById('start-btn');
startButton.onclick = function() {
  if (timer == null) {
    chronometer();
  }
}

var stopButton = document.getElementById('stop-btn');
stopButton.onclick = function() {
  clearTimeout(timer);
  timer = null;
}

var resetButton = document.getElementById('reset-btn');
resetButton.onclick = function() {
  tenthsOfSecond = 0;
  seconds = 0;
  minutes = 0;
  drawTime();
}

var timerRange = document.getElementById('timer-range');
timerRange.onchange=function(){
  stepMiliseconds = 200 - timerRange.value;
  var speed;
  if (stepMiliseconds == 100) {
    speed = 'Normal';
  }
  else {
    speed = Math.round(timerRange.value) / 100 + 'x';
  }
  var speedLabel = document.getElementById('speed-label');
  speedLabel.innerHTML = speed;
}
