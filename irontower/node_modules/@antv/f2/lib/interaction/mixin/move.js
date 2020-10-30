"use strict";

exports.__esModule = true;
exports._handleMove = _handleMove;
exports._doMove = _doMove;
exports._handleLinearScale = _handleLinearScale;
exports._handleCatScale = _handleCatScale;
exports["default"] = void 0;

var _common = require("../../util/common");

var _helper = require("../helper");

var TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend', 'touchStart', 'touchMove', 'touchEnd'];
var DAY_TIMESTAMPS = 86400000;

function _handleMove(e) {
  if (e.type === 'swipe' && e.deltaTime > 350) {
    // 区分 pan 操作和 swipe 操作
    return null;
  }

  var currentDeltaX = this.currentDeltaX,
      currentDeltaY = this.currentDeltaY,
      lastPoint = this.lastPoint;
  var deltaX;
  var deltaY;

  if (TOUCH_EVENTS.indexOf(e.type) !== -1) {
    // support touch and miniprogram
    var currentPoint = e.touches[0];
    deltaX = currentPoint.x - lastPoint.x;
    deltaY = currentPoint.y - lastPoint.y;
    this.lastPoint = currentPoint;
  } else if (currentDeltaX !== null && currentDeltaY !== null) {
    deltaX = e.deltaX - currentDeltaX;
    deltaY = e.deltaY - currentDeltaY;
    this.currentDeltaX = e.deltaX;
    this.currentDeltaY = e.deltaY;
  }

  if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
    var lastTimestamp = this._timestamp;
    var now = +new Date();

    if (now - lastTimestamp > 16) {
      this._doMove(deltaX, deltaY);

      this._timestamp = now;
    }
  }
}

function _doMove(deltaX, deltaY) {
  var self = this;
  var mode = self.mode,
      chart = self.chart,
      limitRange = self.limitRange;
  var coord = chart.get('coord');
  var start = coord.start,
      end = coord.end;
  var data = chart.get('data');

  if ((0, _common.directionEnabled)(mode, 'x') && deltaX !== 0) {
    var xScale = chart.getXScale();
    var xField = xScale.field;

    if (!limitRange[xField]) {
      limitRange[xField] = (0, _helper.getLimitRange)(data, xScale);
    }

    var coordWidth = end.x - start.x;

    if (xScale.isCategory) {
      self._handleCatScale(xScale, deltaX, coordWidth);
    } else if (xScale.isLinear) {
      self._handleLinearScale(xScale, deltaX, coordWidth, 'x');
    }

    self.xRange = (0, _helper.getFieldRange)(xScale, limitRange[xField], xScale.type);
  }

  if ((0, _common.directionEnabled)(mode, 'y') && deltaY !== 0) {
    var coordHeight = start.y - end.y;
    var yScales = chart.getYScales();
    (0, _common.each)(yScales, function (yScale) {
      var yField = yScale.field;

      if (!limitRange[yField]) {
        limitRange[yField] = (0, _helper.getLimitRange)(data, yScale);
      }

      yScale.isLinear && self._handleLinearScale(yScale, deltaY, coordHeight, 'y');
    });
    var scale = yScales[0];
    self.yRange = (0, _helper.getFieldRange)(scale, limitRange[scale.field], scale.type);
  }

  chart.repaint();
}

function _handleLinearScale(scale, delta, range, flag) {
  var field = scale.field,
      min = scale.min,
      max = scale.max;
  var limitRange = this.limitRange;
  if (min === limitRange[field].min && max === limitRange[field].max) return;
  var ratio = delta / range;
  var panValue = ratio * (max - min);
  var newMax = flag === 'x' ? max - panValue : max + panValue;
  var newMin = flag === 'x' ? min - panValue : min + panValue;

  if (limitRange[field] && !(0, _common.isNil)(limitRange[field].min) && newMin <= limitRange[field].min) {
    newMin = limitRange[field].min;
    newMax = max - min + newMin;
  }

  if (limitRange[field] && !(0, _common.isNil)(limitRange[field].max) && newMax >= limitRange[field].max) {
    newMax = limitRange[field].max;
    newMin = newMax - (max - min);
  }

  this.updateLinearScale(field, newMin, newMax);
}

function _handleCatScale(scale, delta, range) {
  var type = scale.type,
      field = scale.field,
      values = scale.values,
      ticks = scale.ticks;
  var duplicateRemovalValues = (0, _common.uniq)(values);
  var originValues = this.limitRange[field];
  var lastValueIndex = originValues.length - 1;
  var currentLength = duplicateRemovalValues.length;
  var speed = this.speed || 1;
  var step = range / (currentLength * speed);
  var firstIndex = originValues.indexOf(duplicateRemovalValues[0]);
  var lastIndex = originValues.indexOf(duplicateRemovalValues[currentLength - 1]);
  var minIndex = firstIndex;
  var maxIndex = lastIndex;
  var ratio = Math.abs(delta / range);
  var panStep = this.step || Math.max(1, parseInt(ratio * currentLength));
  this._panCumulativeDelta += delta;
  minIndex = this._panCumulativeDelta > step ? Math.max(0, minIndex - panStep) : this._panCumulativeDelta < -step ? Math.min(lastValueIndex - currentLength + 1, minIndex + panStep) : minIndex;
  maxIndex = Math.min(lastValueIndex, minIndex + currentLength - 1);

  if (minIndex === firstIndex && maxIndex === lastIndex) {
    return null;
  }

  var newValues = originValues.slice(minIndex, maxIndex + 1);
  var newTicks = null;

  if (type === 'timeCat') {
    var tickGap = ticks.length > 2 ? ticks[1] - ticks[0] : DAY_TIMESTAMPS;

    if (this._panCumulativeDelta > step) {
      for (var i = ticks[0] - tickGap; i >= newValues[0]; i -= tickGap) {
        ticks.unshift(i);
      }
    } else if (this._panCumulativeDelta < -step) {
      for (var _i = ticks[ticks.length - 1] + tickGap; _i <= newValues[newValues.length - 1]; _i += tickGap) {
        ticks.push(_i);
      }
    }

    newTicks = ticks;
  } else {
    // 保留之前的ticks
    newTicks = ticks;
  }

  this.updateCatScale(field, newValues, newTicks, originValues, minIndex, maxIndex);
  this._panCumulativeDelta = minIndex !== firstIndex ? 0 : this._panCumulativeDelta;
}

var _default = {
  _handleMove: _handleMove,
  _doMove: _doMove,
  _handleLinearScale: _handleLinearScale,
  _handleCatScale: _handleCatScale
};
exports["default"] = _default;