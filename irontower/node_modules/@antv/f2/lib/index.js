"use strict";

exports.__esModule = true;
exports["default"] = exports.Component = void 0;

var _core = require("./core");

exports.Global = _core.Global;
exports.Chart = _core.Chart;
exports.Shape = _core.Shape;
exports.G = _core.G;
exports.Util = _core.Util;
exports.Helper = _core.Helper;
exports.track = _core.track;

require("./geom/");

require("./geom/adjust/");

require("./coord/polar");

require("./component/axis/circle");

require("./component/guide/arc");

require("./component/guide/html");

require("./component/guide/line");

require("./component/guide/rect");

require("./component/guide/text");

require("./component/guide/tag");

require("./component/guide/point");

var _marker = _interopRequireDefault(require("./component/marker"));

var Tooltip = _interopRequireWildcard(require("./plugin/tooltip"));

var Guide = _interopRequireWildcard(require("./plugin/guide"));

var Legend = _interopRequireWildcard(require("./plugin/legend"));

var Animation = _interopRequireWildcard(require("./animation/detail"));

var _animate = _interopRequireDefault(require("./animation/animate"));

exports.Animate = _animate["default"];

require("./interaction/new/index");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Default, without interactins
 */
// polar coordinate
// the axis for polar coordinate
var Component = {
  Marker: _marker["default"]
}; // register plugins

exports.Component = Component;

_core.Chart.plugins.register([Tooltip, Legend, Guide, Animation]); // 默认添加交互


var _default = {
  Component: Component,
  Global: _core.Global,
  Chart: _core.Chart,
  Shape: _core.Shape,
  G: _core.G,
  Util: _core.Util,
  Helper: _core.Helper,
  track: _core.track,
  Animate: _animate["default"]
};
exports["default"] = _default;