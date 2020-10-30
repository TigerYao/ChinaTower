"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../util/common");

var _shape = _interopRequireDefault(require("../graphic/shape"));

var _timeline = _interopRequireDefault(require("../graphic/animate/timeline"));

var _animator = _interopRequireDefault(require("../graphic/animate/animator"));

var _animate = _interopRequireDefault(require("./animate"));

var Action = _interopRequireWildcard(require("./group-action"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Group animation
 * @author sima.zhang1990@gmail.com
 */
var timeline;

_shape["default"].prototype.animate = function () {
  var attrs = (0, _common.mix)({}, this.get('attrs'));
  return new _animator["default"](this, attrs, timeline);
};

_animate["default"].Action = Action;
_animate["default"].defaultCfg = {
  line: function line(coord) {
    if (coord.isPolar) {
      return Action.groupScaleInXY;
    }

    return Action.groupWaveIn;
  },
  area: function area(coord) {
    if (coord.isPolar) {
      return Action.groupScaleInXY;
    }

    return Action.groupWaveIn;
  },
  path: function path(coord) {
    if (coord.isPolar) {
      return Action.groupScaleInXY;
    }

    return Action.groupWaveIn;
  },
  point: function point() {
    return Action.shapesScaleInXY;
  },
  interval: function interval(coord) {
    var result;

    if (coord.isPolar) {
      result = Action.groupScaleInXY;

      if (coord.transposed) {
        result = Action.groupWaveIn;
      }
    } else {
      result = coord.transposed ? Action.groupScaleInX : Action.groupScaleInY;
    }

    return result;
  },
  schema: function schema() {
    return Action.groupWaveIn;
  }
};

function getAnimate(geomType, coord, animationName) {
  var result;

  if (animationName) {
    result = _animate["default"].Action[animationName];
  } else {
    result = _animate["default"].getAnimation(geomType, coord, 'appear');
  }

  return result;
}

function getAnimateCfg(geomType, animateCfg) {
  var defaultCfg = _animate["default"].getAnimateCfg(geomType, 'appear');

  if (animateCfg && animateCfg.appear) {
    return (0, _common.deepMix)({}, defaultCfg, animateCfg.appear);
  }

  return defaultCfg;
}

var _default = {
  afterCanvasInit: function afterCanvasInit()
  /* chart */
  {
    timeline = new _timeline["default"]();
    timeline.play();
  },
  beforeCanvasDraw: function beforeCanvasDraw(chart) {
    if (chart.get('animate') === false) {
      return;
    }

    var geoms = chart.get('geoms');
    var coord = chart.get('coord');
    var animateCfg;
    var animate;
    (0, _common.each)(geoms, function (geom) {
      var type = geom.get('type');
      var container = geom.get('container');

      if (geom.get('animateCfg') !== false) {
        animateCfg = getAnimateCfg(type, geom.get('animateCfg'));
        animate = getAnimate(type, coord, animateCfg.animation);

        if ((0, _common.isFunction)(animate)) {
          animate(container, animateCfg);
        } else if (_animate["default"].defaultCfg[type]) {
          animate = _animate["default"].defaultCfg[type](coord);
          var yScale = geom.getYScale();
          var zeroY = coord.convertPoint({
            x: 0,
            y: yScale.scale(geom.getYMinValue())
          });
          animate && animate(container, animateCfg, coord, zeroY);
        }
      }
    });
  },
  afterCanvasDestroyed: function afterCanvasDestroyed()
  /* chart */
  {
    timeline.stop();
  }
};
exports["default"] = _default;