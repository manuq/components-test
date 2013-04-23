'use strict';

function Chronometer(scope) {
  this.scope = scope;
  this.counter = "Hello World!";

  this.timer = null;

  this.tenthsOfSecond = 0;
  this.seconds = 0;
  this.minutes = 0;

  this.speed = 100;
}

Chronometer.prototype.drawTime = function() {
  var html = this.minutes + ':' + this.seconds + '.' + this.tenthsOfSecond;
  this.counter = html;
  this.scope.$apply();
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
                          200 - this.speed);
}

Chronometer.prototype.start = function() {
  if (this.timer == null) {
    this.chronometerTick();
  }
}
Chronometer.prototype.stop = function() {
  clearTimeout(this.timer);
  this.timer = null;
  $scope
}
Chronometer.prototype.reset = function() {
  this.tenthsOfSecond = 0;
  this.seconds = 0;
  this.minutes = 0;
  this.drawTime();
}

function StopWatchCtrl($scope) {
  $scope.hello = "hola mundo";
  $scope.chronometers = [
    new Chronometer($scope),
    new Chronometer($scope),
    new Chronometer($scope)
  ];
}

angular.module('myFilters', []).filter('humanizeSpeed', function() {
  return function(input) {
    if (input == 100) {
      return 'Normal';
    }
    return input / 100 + 'x';
  };
});

angular.module('components', ['myFilters']).
directive('chronometer', function() {
  return {
    restrict: 'E',
    transclude: true,
      scope: { title: '@' },
//      link: function(scope, element, attrs, tabsCtrl) {
//        tabsCtrl.addPane(scope);
//      },
      template:
      '<div class="chronometer">' +
      '<p class="counter">{{title}}</p>' +
      '<button class="start-btn">Start</button>' +
      '<button class="stop-btn">Stop</button>' +
      '<button class="reset-btn">Reset</button>' +
      '<label>Speed:</label>' +
      '<input class="timer-range" type="range" min="10" max="200" step="10" value="100">' +
      '<label class="speed-label">Normal</label>' +
      '</div>',
      replace: true
    };
  })
