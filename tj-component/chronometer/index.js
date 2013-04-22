var nextTick = require('next-tick')
var event = require('event')
var html = require('./template')

module.exports = Chronometer;

function Chronometer(el) {
  if (!(this instanceof Chronometer)) {
    return new Chronometer(el);
  };
  this.el = el;
  this.el.innerHTML = html;

  this.timer = null;

  this.tenthsOfSecond = 0;
  this.seconds = 0;
  this.minutes = 0;

  this.stepMiliseconds = 100;

  this.counter = this.el.querySelector('.counter');

  var _this = this;
  var startButton = this.el.querySelector('.start-btn');
  startButton.onclick = function() {
    _this.onStartClicked();
  }
  var stopButton = this.el.querySelector('.stop-btn');
  stopButton.onclick = function() {
    _this.onStopClicked();
  }
  var resetButton = this.el.querySelector('.reset-btn');
  resetButton.onclick = function() {
    _this.onResetClicked();
  }
  var timerRange = this.el.querySelector('.timer-range');
  timerRange.onchange=function(){
    _this.onSpeedChanged();
  }
}

Chronometer.prototype.drawTime = function() {
  var html = this.minutes + ':' + this.seconds + '.' + this.tenthsOfSecond;
  this.counter.innerHTML = html;
}

Chronometer.prototype.chronometerTick = function() {
  this.tenthsOfSecond += 1;
  if (this.tenthsOfSecond == 10) {
    this.tenthsOfSecond = 0;
    this.seconds += 1;
  }
  if (this.seconds == 60) {
    this.seconds = 0;
    this.minutes += 1;
  }

  this.drawTime();

  // call this function again in 100 miliseconds
  var _this = this;
  this.timer = setTimeout(function() {_this.chronometerTick()},
                          this.stepMiliseconds);
}

Chronometer.prototype.onStartClicked = function() {
  if (this.timer == null) {
    this.chronometerTick();
  }
}

Chronometer.prototype.onStopClicked = function() {
  clearTimeout(this.timer);
  this.timer = null;
}

Chronometer.prototype.onResetClicked = function() {
  this.tenthsOfSecond = 0;
  this.seconds = 0;
  this.minutes = 0;
  this.drawTime();
}

Chronometer.prototype.onSpeedChanged = function() {
  var timerRange = this.el.querySelector('.timer-range');
  this.stepMiliseconds = 200 - timerRange.value;
  var speed;
  if (this.stepMiliseconds == 100) {
    speed = 'Normal';
  }
  else {
    speed = Math.round(timerRange.value) / 100 + 'x';
  }
  var speedLabel = this.el.querySelector('.speed-label');
  speedLabel.innerHTML = speed;
}
