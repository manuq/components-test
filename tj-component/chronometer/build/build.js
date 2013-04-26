
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
  }

  if (require.aliases.hasOwnProperty(index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("timoxley-next-tick/index.js", Function("exports, require, module",
"if (typeof setImmediate === 'function') {\n  module.exports = setImmediate\n}\n// handle node.js\nelse if (typeof process !== 'undefined' && process && typeof process.nextTick === 'function') {\n  module.exports = function(fn){ return process.nextTick(fn) };\n}\n// fallback for other environments / postMessage behaves badly on IE8\nelse if (typeof window === 'undefined' || window.ActiveXObject || !window.postMessage) {\n  module.exports = setTimeout;\n} else {\n  var q = [];\n\n  window.addEventListener('message', function(e){\n    var i = 0;\n    while (i < q.length) q[i++]();\n    q.length = 0;\n  }, true);\n\n  module.exports = function(fn){\n    if (!q.length) window.postMessage('tic!', '*');\n    q.push(fn);\n  }\n}\n//@ sourceURL=timoxley-next-tick/index.js"
));
require.register("component-event/index.js", Function("exports, require, module",
"\n/**\n * Bind `el` event `type` to `fn`.\n *\n * @param {Element} el\n * @param {String} type\n * @param {Function} fn\n * @param {Boolean} capture\n * @return {Function}\n * @api public\n */\n\nexports.bind = function(el, type, fn, capture){\n  if (el.addEventListener) {\n    el.addEventListener(type, fn, capture || false);\n  } else {\n    el.attachEvent('on' + type, fn);\n  }\n  return fn;\n};\n\n/**\n * Unbind `el` event `type`'s callback `fn`.\n *\n * @param {Element} el\n * @param {String} type\n * @param {Function} fn\n * @param {Boolean} capture\n * @return {Function}\n * @api public\n */\n\nexports.unbind = function(el, type, fn, capture){\n  if (el.removeEventListener) {\n    el.removeEventListener(type, fn, capture || false);\n  } else {\n    el.detachEvent('on' + type, fn);\n  }\n  return fn;\n};\n//@ sourceURL=component-event/index.js"
));
require.register("chronometer/index.js", Function("exports, require, module",
"var nextTick = require('next-tick')\nvar event = require('event')\nvar html = require('./template')\n\nmodule.exports = Chronometer;\n\nfunction Chronometer(el) {\n  if (!(this instanceof Chronometer)) {\n    return new Chronometer(el);\n  };\n  this.el = el;\n  this.el.innerHTML = html;\n\n  this.timer = null;\n\n  this.tenthsOfSecond = 0;\n  this.seconds = 0;\n  this.minutes = 0;\n\n  this.stepMiliseconds = 100;\n\n  this.counter = this.el.querySelector('.counter');\n\n  var _this = this;\n  var startButton = this.el.querySelector('.start-btn');\n  startButton.onclick = function() {\n    _this.onStartClicked();\n  }\n  var stopButton = this.el.querySelector('.stop-btn');\n  stopButton.onclick = function() {\n    _this.onStopClicked();\n  }\n  var resetButton = this.el.querySelector('.reset-btn');\n  resetButton.onclick = function() {\n    _this.onResetClicked();\n  }\n  var timerRange = this.el.querySelector('.timer-range');\n  timerRange.onchange=function(){\n    _this.onSpeedChanged();\n  }\n}\n\nChronometer.prototype.drawTime = function() {\n  var html = this.minutes + ':' + this.seconds + '.' + this.tenthsOfSecond;\n  this.counter.innerHTML = html;\n}\n\nChronometer.prototype.chronometerTick = function() {\n  this.tenthsOfSecond += 1;\n  if (this.tenthsOfSecond == 10) {\n    this.tenthsOfSecond = 0;\n    this.seconds += 1;\n  }\n  if (this.seconds == 60) {\n    this.seconds = 0;\n    this.minutes += 1;\n  }\n\n  this.drawTime();\n\n  // call this function again in 100 miliseconds\n  var _this = this;\n  this.timer = setTimeout(function() {_this.chronometerTick()},\n                          this.stepMiliseconds);\n}\n\nChronometer.prototype.onStartClicked = function() {\n  if (this.timer == null) {\n    this.chronometerTick();\n  }\n}\n\nChronometer.prototype.onStopClicked = function() {\n  clearTimeout(this.timer);\n  this.timer = null;\n}\n\nChronometer.prototype.onResetClicked = function() {\n  this.tenthsOfSecond = 0;\n  this.seconds = 0;\n  this.minutes = 0;\n  this.drawTime();\n}\n\nChronometer.prototype.onSpeedChanged = function() {\n  var timerRange = this.el.querySelector('.timer-range');\n  this.stepMiliseconds = 200 - timerRange.value;\n  var speed;\n  if (this.stepMiliseconds == 100) {\n    speed = 'Normal';\n  }\n  else {\n    speed = Math.round(timerRange.value) / 100 + 'x';\n  }\n  var speedLabel = this.el.querySelector('.speed-label');\n  speedLabel.innerHTML = speed;\n}\n//@ sourceURL=chronometer/index.js"
));
require.register("chronometer/template.js", Function("exports, require, module",
"module.exports = '<p class=\"counter\">Hello World!</p>\\n<button class=\"start-btn\">Start</button>\\n<button class=\"stop-btn\">Stop</button>\\n<button class=\"reset-btn\">Reset</button>\\n<label>Speed:</label>\\n<input class=\"timer-range\" type=\"range\" min=\"10\" max=\"200\" step=\"10\" value=\"100\">\\n<label class=\"speed-label\">Normal</label>\\n';//@ sourceURL=chronometer/template.js"
));
require.alias("timoxley-next-tick/index.js", "chronometer/deps/next-tick/index.js");

require.alias("component-event/index.js", "chronometer/deps/event/index.js");

