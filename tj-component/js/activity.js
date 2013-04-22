var chronometer = require('chronometer');
var els = document.querySelectorAll('.chronometer');
for (var i=0; i<els.length; i++) {
  chronometer(els[i]);
}
