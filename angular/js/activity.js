angular.module('components', []).
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
      '<p id="counter">{{title}}</p>' +
      '<button id="start-btn">Start</button>' +
      '<button id="stop-btn">Stop</button>' +
      '<button id="reset-btn">Reset</button>' +
      '<label>Speed:</label>' +
      '<input id="timer-range" type="range" min="10" max="200" step="10" value="100">' +
      '<label id="speed-label">Normal</label>' +
      '</div>',
      replace: true
    };
  })
