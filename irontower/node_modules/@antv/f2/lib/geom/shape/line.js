"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _global = _interopRequireDefault(require("../../global"));

var _shape = _interopRequireDefault(require("./shape"));

var _common = require("../../util/common");

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// register line geom
var Line = _shape["default"].registerFactory('line', {
  defaultShapeType: 'line'
});

function getStyle(cfg) {
  var style = {
    strokeStyle: cfg.color
  };

  if (cfg.size >= 0) {
    style.lineWidth = cfg.size;
  }

  (0, _common.mix)(style, cfg.style);
  return (0, _common.mix)({}, _global["default"].shape.line, style);
}

function drawLines(cfg, container, style, smooth) {
  var points = cfg.points;

  if (points.length && (0, _common.isArray)(points[0].y)) {
    var topPoints = [];
    var bottomPoints = [];

    for (var i = 0, len = points.length; i < len; i++) {
      var point = points[i];
      var tmp = (0, _util.splitPoints)(point);
      bottomPoints.push(tmp[0]);
      topPoints.push(tmp[1]);
    }

    if (cfg.isInCircle) {
      topPoints.push(topPoints[0]);
      bottomPoints.push(bottomPoints[0]);
    }

    if (cfg.isStack) {
      return container.addShape('Polyline', {
        className: 'line',
        attrs: (0, _common.mix)({
          points: topPoints,
          smooth: smooth
        }, style)
      });
    }

    var topShape = container.addShape('Polyline', {
      className: 'line',
      attrs: (0, _common.mix)({
        points: topPoints,
        smooth: smooth
      }, style)
    });
    var bottomShape = container.addShape('Polyline', {
      className: 'line',
      attrs: (0, _common.mix)({
        points: bottomPoints,
        smooth: smooth
      }, style)
    });
    return [topShape, bottomShape];
  }

  if (cfg.isInCircle) {
    points.push(points[0]);
  }

  return container.addShape('Polyline', {
    className: 'line',
    attrs: (0, _common.mix)({
      points: points,
      smooth: smooth
    }, style)
  });
}

var SHAPES = ['line', 'smooth', 'dash'];
(0, _common.each)(SHAPES, function (shapeType) {
  _shape["default"].registerShape('line', shapeType, {
    draw: function draw(cfg, container) {
      var smooth = shapeType === 'smooth';
      var style = getStyle(cfg);

      if (shapeType === 'dash') {
        style.lineDash = _global["default"].lineDash;
      }

      return drawLines(cfg, container, style, smooth);
    }
  });
});
var _default = Line;
exports["default"] = _default;