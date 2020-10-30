"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var Easing = _interopRequireWildcard(require("./easing"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function plainArray(arr) {
  var result = [];

  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i]) {
      result.push(arr[i].x);
      result.push(arr[i].y);
    }
  }

  return result;
}

function interpolateNumber(a, b) {
  a = +a;
  b -= a;
  return function (t) {
    return a + b * t;
  };
}

function interpolateArray(a, b) {
  var nb = b ? b.length : 0;
  var na = a ? Math.min(nb, a.length) : 0;
  var x = new Array(na);
  var c = new Array(nb);
  var i;

  for (i = 0; i < na; ++i) {
    x[i] = interpolateNumber(a[i], b[i]);
  }

  for (; i < nb; ++i) {
    c[i] = b[i];
  }

  return function (t) {
    for (i = 0; i < na; ++i) {
      c[i] = x[i](t);
    }

    return c;
  };
}

var Animator = /*#__PURE__*/function () {
  function Animator(shape, source, timeline) {
    this.hasStarted = false;
    this.hasEnded = false;
    this.shape = shape;
    this.source = source;
    this.timeline = timeline;
    this.animate = null;
  } // delay, attrs, duration, easing


  var _proto = Animator.prototype;

  _proto.to = function to(cfg) {
    if (cfg === void 0) {
      cfg = {};
    }

    var delay = cfg.delay || 0;
    var attrs = cfg.attrs || {};
    var duration = cfg.duration || 1000;
    var easing; // 缓动函数

    if (typeof cfg.easing === 'function') {
      easing = cfg.easing;
    } else {
      easing = Easing[cfg.easing] || Easing.linear;
    }

    var animInfo = {
      shape: this.shape,
      startTime: this.timeline.time + delay,
      duration: duration,
      easing: easing
    };
    var interpolate = {}; // 差值函数

    for (var attrName in attrs) {
      var startValue = this.source[attrName];
      var endValue = attrs[attrName];

      if (attrName === 'points') {
        startValue = plainArray(startValue);
        endValue = plainArray(endValue);
        interpolate.points = interpolateArray(startValue, endValue);
        this.source.points = startValue;
        attrs.points = endValue;
      } else if (attrName === 'matrix') {
        interpolate.matrix = interpolateArray(startValue, endValue);
      } else {
        interpolate[attrName] = interpolateNumber(startValue, endValue);
      }
    }

    animInfo.interpolate = interpolate;
    animInfo.startState = this.source;
    animInfo.endState = attrs;
    animInfo.endTime = animInfo.startTime + duration;
    this.timeline.pushAnim(animInfo);
    this.animate = animInfo;
    return this;
  };

  _proto.onFrame = function onFrame(callback) {
    // 自定义每一帧动画的动作
    if (this.animate) {
      this.animate.onFrame = function (frame) {
        callback(frame);
      };
    }

    return this;
  };

  _proto.onStart = function onStart(callback) {
    if (this.animate) {
      this.animate.onStart = function () {
        callback();
      };
    }

    return this;
  };

  _proto.onUpdate = function onUpdate(callback) {
    if (this.animate) {
      this.animate.onUpdate = function (frame) {
        callback(frame);
      };
    }

    return this;
  };

  _proto.onEnd = function onEnd(callback) {
    if (this.animate) {
      this.animate.onEnd = function () {
        callback();
      };
    }

    return this;
  };

  return Animator;
}();

var _default = Animator;
exports["default"] = _default;