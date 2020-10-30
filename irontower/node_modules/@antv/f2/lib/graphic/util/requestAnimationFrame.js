"use strict";

exports.__esModule = true;
exports.requestAnimationFrame = void 0;
var requestAnimationFrame = typeof window === 'object' && window.requestAnimationFrame ? window.requestAnimationFrame : function (fn) {
  return setTimeout(fn, 16);
};
exports.requestAnimationFrame = requestAnimationFrame;