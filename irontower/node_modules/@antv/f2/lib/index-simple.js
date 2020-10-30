"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _core = require("./core");

exports.Global = _core.Global;
exports.Chart = _core.Chart;
exports.Shape = _core.Shape;
exports.G = _core.G;
exports.Util = _core.Util;
exports.Helper = _core.Helper;
exports.track = _core.track;

require("./geom/line");

require("./geom/interval");

require("./geom/adjust/");

require("./coord/polar");

/**
 * Only support simple bar chart, line chart and pie chart
 */
var _default = {
  Global: _core.Global,
  Chart: _core.Chart,
  Shape: _core.Shape,
  G: _core.G,
  Util: _core.Util,
  Helper: _core.Helper,
  track: _core.track
};
exports["default"] = _default;