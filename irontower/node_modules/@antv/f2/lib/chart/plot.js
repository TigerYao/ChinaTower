"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../util/common");

var Plot = /*#__PURE__*/function () {
  function Plot(cfg) {
    (0, _common.mix)(this, cfg);

    this._init();
  }

  var _proto = Plot.prototype;

  _proto._init = function _init() {
    var self = this;
    var start = self.start;
    var end = self.end;
    var xMin = Math.min(start.x, end.x);
    var xMax = Math.max(start.x, end.x);
    var yMin = Math.min(start.y, end.y);
    var yMax = Math.max(start.y, end.y);
    this.tl = {
      x: xMin,
      y: yMin
    };
    this.tr = {
      x: xMax,
      y: yMin
    };
    this.bl = {
      x: xMin,
      y: yMax
    };
    this.br = {
      x: xMax,
      y: yMax
    };
    this.width = xMax - xMin;
    this.height = yMax - yMin;
  }
  /**
   * reset
   * @param  {Object} start start point
   * @param  {Object} end end point
   */
  ;

  _proto.reset = function reset(start, end) {
    this.start = start;
    this.end = end;

    this._init();
  }
  /**
   * check the point is in the range of plot
   * @param  {Number}  x x value
   * @param  {[type]}  y y value
   * @return {Boolean} return the result
   */
  ;

  _proto.isInRange = function isInRange(x, y) {
    if ((0, _common.isObject)(x)) {
      y = x.y;
      x = x.x;
    }

    var tl = this.tl;
    var br = this.br;
    return tl.x <= x && x <= br.x && tl.y <= y && y <= br.y;
  };

  return Plot;
}();

var _default = Plot;
exports["default"] = _default;