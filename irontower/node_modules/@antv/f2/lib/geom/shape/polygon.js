"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _shape = _interopRequireDefault(require("./shape"));

var _common = require("../../util/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Polygon = _shape["default"].registerFactory('polygon', {
  defaultShapeType: 'polygon',
  getDefaultPoints: function getDefaultPoints(pointInfo) {
    var points = [];
    var x = pointInfo.x,
        y = pointInfo.y;

    for (var i = 0, len = x.length; i < len; i++) {
      points.push({
        x: x[i],
        y: y[i]
      });
    }

    return points;
  }
});

_shape["default"].registerShape('polygon', 'polygon', {
  draw: function draw(cfg, container) {
    var points = this.parsePoints(cfg.points);
    var style = (0, _common.mix)({
      fill: cfg.color,
      points: points
    }, cfg.style);
    return container.addShape('Polygon', {
      className: 'polygon',
      attrs: style
    });
  }
});

var _default = Polygon;
exports["default"] = _default;