"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _global = _interopRequireDefault(require("../../global"));

var _shape = _interopRequireDefault(require("./shape"));

var _common = require("../../util/common");

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SHAPES = ['circle', 'hollowCircle', 'rect'];

var Point = _shape["default"].registerFactory('point', {
  defaultShapeType: 'circle',
  getDefaultPoints: function getDefaultPoints(pointInfo) {
    return (0, _util.splitPoints)(pointInfo);
  }
});

function getPointsCfg(cfg) {
  var style = {
    lineWidth: 0,
    stroke: cfg.color,
    fill: cfg.color
  };

  if (cfg.size) {
    style.size = cfg.size;
  }

  (0, _common.mix)(style, cfg.style);
  return (0, _common.mix)({}, _global["default"].shape.point, style);
}

function drawShape(cfg, container, shape) {
  if (cfg.size === 0) return;
  var pointCfg = getPointsCfg(cfg);
  var size = pointCfg.r || pointCfg.size;
  var x = cfg.x;
  var y = !(0, _common.isArray)(cfg.y) ? [cfg.y] : cfg.y;

  if (shape === 'hollowCircle') {
    pointCfg.lineWidth = 1;
    pointCfg.fill = null;
  }

  for (var i = 0, len = y.length; i < len; i++) {
    if (shape === 'rect') {
      return container.addShape('Rect', {
        className: 'point',
        attrs: (0, _common.mix)({
          x: x - size,
          y: y[i] - size,
          width: size * 2,
          height: size * 2
        }, pointCfg)
      });
    }

    return container.addShape('Circle', {
      className: 'point',
      attrs: (0, _common.mix)({
        x: x,
        y: y[i],
        r: size
      }, pointCfg)
    });
  }
}

(0, _common.each)(SHAPES, function (shapeType) {
  _shape["default"].registerShape('point', shapeType, {
    draw: function draw(cfg, container) {
      return drawShape(cfg, container, shapeType);
    }
  });
});
var _default = Point;
exports["default"] = _default;