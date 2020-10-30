"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../../util/common");

var _index = _interopRequireDefault(require("../../component/axis/index"));

var _global = _interopRequireDefault(require("../../global"));

var _index2 = require("../../graphic/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function formatTicks(ticks) {
  var tmp = ticks.slice(0);

  if (tmp.length > 0) {
    var first = tmp[0];
    var last = tmp[tmp.length - 1];

    if (first.value !== 0) {
      tmp.unshift({
        value: 0
      });
    }

    if (last.value !== 1) {
      tmp.push({
        value: 1
      });
    }
  }

  return tmp;
}

var AxisController = /*#__PURE__*/function () {
  function AxisController(cfg) {
    this.axisCfg = {};
    this.frontPlot = null;
    this.backPlot = null;
    this.axes = {}; // store the axes's options

    (0, _common.mix)(this, cfg);
  }

  var _proto = AxisController.prototype;

  _proto._isHide = function _isHide(field) {
    var axisCfg = this.axisCfg;
    return !axisCfg || axisCfg[field] === false;
  };

  _proto._getLinePosition = function _getLinePosition(scale, dimType, index, transposed) {
    var position = '';
    var field = scale.field;
    var axisCfg = this.axisCfg;

    if (axisCfg[field] && axisCfg[field].position) {
      position = axisCfg[field].position;
    } else if (dimType === 'x') {
      position = transposed ? 'left' : 'bottom';
    } else if (dimType === 'y') {
      position = index ? 'right' : 'left';

      if (transposed) {
        position = 'bottom';
      }
    }

    return position;
  };

  _proto._getLineCfg = function _getLineCfg(coord, dimType, position) {
    var start;
    var end;
    var factor = 1; // Mark clockwise or counterclockwise

    if (dimType === 'x') {
      start = {
        x: 0,
        y: 0
      };
      end = {
        x: 1,
        y: 0
      };
    } else {
      if (position === 'right') {
        // there will be several y axes
        start = {
          x: 1,
          y: 0
        };
        end = {
          x: 1,
          y: 1
        };
      } else {
        start = {
          x: 0,
          y: 0
        };
        end = {
          x: 0,
          y: 1
        };
        factor = -1;
      }
    }

    if (coord.transposed) {
      factor *= -1;
    }

    return {
      offsetFactor: factor,
      start: coord.convertPoint(start),
      end: coord.convertPoint(end)
    };
  };

  _proto._getCircleCfg = function _getCircleCfg(coord) {
    return {
      startAngle: coord.startAngle,
      endAngle: coord.endAngle,
      center: coord.center,
      radius: coord.circleRadius
    };
  };

  _proto._getRadiusCfg = function _getRadiusCfg(coord) {
    var transposed = coord.transposed;
    var start;
    var end;

    if (transposed) {
      start = {
        x: 0,
        y: 0
      };
      end = {
        x: 1,
        y: 0
      };
    } else {
      start = {
        x: 0,
        y: 0
      };
      end = {
        x: 0,
        y: 1
      };
    }

    return {
      offsetFactor: -1,
      start: coord.convertPoint(start),
      end: coord.convertPoint(end)
    };
  };

  _proto._getAxisCfg = function _getAxisCfg(coord, scale, verticalScale, dimType, defaultCfg) {
    var self = this;
    var axisCfg = this.axisCfg;
    var ticks = scale.getTicks();
    var cfg = (0, _common.deepMix)({
      ticks: ticks,
      frontContainer: this.frontPlot,
      backContainer: this.backPlot
    }, defaultCfg, axisCfg[scale.field]);
    var labels = [];
    var label = cfg.label;
    var count = ticks.length;
    var maxWidth = 0;
    var maxHeight = 0;
    var labelCfg = label;
    (0, _common.each)(ticks, function (tick, index) {
      if ((0, _common.isFunction)(label)) {
        var executedLabel = label(tick.text, index, count);
        labelCfg = executedLabel ? (0, _common.mix)({}, _global["default"]._defaultAxis.label, executedLabel) : null;
      }

      if (labelCfg) {
        var textStyle = {};

        if (labelCfg.textAlign) {
          textStyle.textAlign = labelCfg.textAlign;
        }

        if (labelCfg.textBaseline) {
          textStyle.textBaseline = labelCfg.textBaseline;
        }

        var axisLabel = new _index2.Shape.Text({
          className: 'axis-label',
          attrs: (0, _common.mix)({
            x: 0,
            y: 0,
            text: tick.text,
            fontFamily: self.chart.get('canvas').get('fontFamily')
          }, labelCfg),
          value: tick.value,
          textStyle: textStyle,
          top: labelCfg.top,
          context: self.chart.get('canvas').get('context')
        });
        labels.push(axisLabel);

        var _axisLabel$getBBox = axisLabel.getBBox(),
            width = _axisLabel$getBBox.width,
            height = _axisLabel$getBBox.height;

        maxWidth = Math.max(maxWidth, width);
        maxHeight = Math.max(maxHeight, height);
      }
    });
    cfg.labels = labels;
    cfg.maxWidth = maxWidth;
    cfg.maxHeight = maxHeight;
    return cfg;
  };

  _proto._createAxis = function _createAxis(coord, scale, verticalScale, dimType, index) {
    if (index === void 0) {
      index = '';
    }

    var self = this;
    var coordType = coord.type;
    var transposed = coord.transposed;
    var type;
    var key;
    var defaultCfg;

    if (coordType === 'cartesian' || coordType === 'rect') {
      var position = self._getLinePosition(scale, dimType, index, transposed);

      defaultCfg = _global["default"].axis[position];
      defaultCfg.position = position;
      type = 'Line';
      key = position;
    } else {
      if (dimType === 'x' && !transposed || dimType === 'y' && transposed) {
        defaultCfg = _global["default"].axis.circle;
        type = 'Circle';
        key = 'circle';
      } else {
        defaultCfg = _global["default"].axis.radius;
        type = 'Line';
        key = 'radius';
      }
    }

    var cfg = self._getAxisCfg(coord, scale, verticalScale, dimType, defaultCfg);

    cfg.type = type;
    cfg.dimType = dimType;
    cfg.verticalScale = verticalScale;
    cfg.index = index;
    this.axes[key] = cfg;
  };

  _proto.createAxis = function createAxis(coord, xScale, yScales) {
    var self = this;

    if (xScale && !self._isHide(xScale.field)) {
      self._createAxis(coord, xScale, yScales[0], 'x');
    }

    (0, _common.each)(yScales, function (yScale, index) {
      if (!self._isHide(yScale.field)) {
        self._createAxis(coord, yScale, xScale, 'y', index);
      }
    });
    var axes = this.axes;
    var chart = self.chart;

    if (chart._isAutoPadding()) {
      var userPadding = (0, _common.parsePadding)(chart.get('padding'));
      var appendPadding = (0, _common.parsePadding)(chart.get('appendPadding'));
      var legendRange = chart.get('legendRange') || {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
      var padding = [userPadding[0] === 'auto' ? legendRange.top + appendPadding[0] * 2 : userPadding[0], userPadding[1] === 'auto' ? legendRange.right + appendPadding[1] : userPadding[1], userPadding[2] === 'auto' ? legendRange.bottom + appendPadding[2] : userPadding[2], userPadding[3] === 'auto' ? legendRange.left + appendPadding[3] : userPadding[3]];

      if (coord.isPolar) {
        var circleAxis = axes.circle;

        if (circleAxis) {
          var maxHeight = circleAxis.maxHeight,
              maxWidth = circleAxis.maxWidth,
              labelOffset = circleAxis.labelOffset;
          padding[0] += maxHeight + labelOffset;
          padding[1] += maxWidth + labelOffset;
          padding[2] += maxHeight + labelOffset;
          padding[3] += maxWidth + labelOffset;
        }
      } else {
        if (axes.right && userPadding[1] === 'auto') {
          var _axes$right = axes.right,
              _maxWidth = _axes$right.maxWidth,
              _labelOffset = _axes$right.labelOffset;
          padding[1] += _maxWidth + _labelOffset;
        }

        if (axes.left && userPadding[3] === 'auto') {
          var _axes$left = axes.left,
              _maxWidth2 = _axes$left.maxWidth,
              _labelOffset2 = _axes$left.labelOffset;
          padding[3] += _maxWidth2 + _labelOffset2;
        }

        if (axes.bottom && userPadding[2] === 'auto') {
          var _axes$bottom = axes.bottom,
              _maxHeight = _axes$bottom.maxHeight,
              _labelOffset3 = _axes$bottom.labelOffset;
          padding[2] += _maxHeight + _labelOffset3;
        }
      }

      chart.set('_padding', padding);

      chart._updateLayout(padding);
    }

    (0, _common.each)(axes, function (axis) {
      var type = axis.type,
          grid = axis.grid,
          verticalScale = axis.verticalScale,
          ticks = axis.ticks,
          dimType = axis.dimType,
          position = axis.position,
          index = axis.index;
      var appendCfg;

      if (coord.isPolar) {
        if (type === 'Line') {
          appendCfg = self._getRadiusCfg(coord);
        } else if (type === 'Circle') {
          appendCfg = self._getCircleCfg(coord);
        }
      } else {
        appendCfg = self._getLineCfg(coord, dimType, position);
      }

      if (grid && verticalScale) {
        var gridPoints = [];
        var verticalTicks = formatTicks(verticalScale.getTicks());
        (0, _common.each)(ticks, function (tick) {
          var subPoints = [];
          (0, _common.each)(verticalTicks, function (verticalTick) {
            var x = dimType === 'x' ? tick.value : verticalTick.value;
            var y = dimType === 'x' ? verticalTick.value : tick.value;

            if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
              var point = coord.convertPoint({
                x: x,
                y: y
              });
              subPoints.push(point);
            }
          });
          gridPoints.push({
            points: subPoints,
            _id: 'axis-' + dimType + index + '-grid-' + tick.tickValue
          });
        });
        axis.gridPoints = gridPoints;

        if (coord.isPolar) {
          axis.center = coord.center;
          axis.startAngle = coord.startAngle;
          axis.endAngle = coord.endAngle;
        }
      }

      appendCfg._id = 'axis-' + dimType;

      if (!(0, _common.isNil)(index)) {
        appendCfg._id = 'axis-' + dimType + index;
      }

      new _index["default"][type]((0, _common.mix)(axis, appendCfg));
    });
  };

  _proto.clear = function clear() {
    this.axes = {};
    this.frontPlot.clear();
    this.backPlot.clear();
  };

  return AxisController;
}();

var _default = AxisController;
exports["default"] = _default;