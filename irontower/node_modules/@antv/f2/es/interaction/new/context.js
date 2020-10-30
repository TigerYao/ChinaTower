function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { getTickMethod } from '../../scale';
import { getRange } from '../../util/array';
import { EVENT_AFTER_INIT, EVENT_AFTER_DATA_CHANGE } from '../../chart/const';
import { toTimeStamp } from '../../util/common'; // 判断新老values是否相等，这里只要判断前后是否相等即可

function isValuesEqual(values, newValues) {
  if (values.length !== newValues.length) {
    return false;
  }

  var lastIndex = values.length - 1;
  return values[0] === newValues[0] && values[lastIndex] === newValues[lastIndex];
} // 不同交互之间共享的上下文


var defaultRange = [0, 1];

class Context {
  // 最开始的原始值
  // 当前显示的范围
  // 缩放最小的点数
  // 最小的缩放比例, 默认通过minCount计算
  // minScale = 0.01;
  // 交互开始时，ticks个数，主要为了每次缩放后，更新ticks个数
  // lastTickCount;
  constructor(chart) {
    var _this = this;

    _defineProperty(this, "chart", null);

    _defineProperty(this, "values", null);

    _defineProperty(this, "range", defaultRange);

    _defineProperty(this, "startRange", defaultRange);

    _defineProperty(this, "minCount", 10);

    _defineProperty(this, "_afterinit", function () {
      // 初始化value值
      var scale = _this.getPinchScale(); // 记录原始全量数据


      var values = [].concat(scale.values);
      _this.values = values; // 最小的缩放比例

      if (!_this.minScale) {
        _this.minScale = _this.minCount / values.length;
      } // 初始化的时候有设置range，则初始化成默认比例


      if (_this.range !== defaultRange) {
        _this.updateRange(_this.range);

        _this.updateTicks();
      }
    });

    _defineProperty(this, "_afterdatachange", function () {
      _this.updateRange(_this.range);
    });

    this.chart = chart;

    this._initEvent(chart);
  }

  _initEvent(chart) {
    // 在整体初始化后还需要设置一些初始状态
    chart.on(EVENT_AFTER_INIT, this._afterinit);
    chart.on(EVENT_AFTER_DATA_CHANGE, this._afterdatachange);
  } // 缩放的主轴scale


  getPinchScale() {
    var {
      chart
    } = this; // 默认缩放x轴

    var scale = chart.getXScale();
    return scale;
  } // 跟随轴的scale


  getFollowScale() {
    var {
      chart
    } = this; // 默认缩放x轴

    var scales = chart.getYScales() || [];
    return scales[0];
  }

  start() {
    var {
      range
    } = this;
    var scale = this.getPinchScale();
    var [start, end] = range; // 记录交互起始的范围

    this.startRange = [start, end]; // 记录开始时的ticks个数

    this.lastTickCount = scale.tickCount;
  }

  doZoom(leftScale, rightScale, zoom) {
    var {
      startRange: range,
      minScale
    } = this;
    var [start, end] = range;
    var zoomOffset = 1 - zoom;
    var rangeLen = end - start;
    var rangeOffset = rangeLen * zoomOffset;
    var leftOffset = rangeOffset * leftScale;
    var rightOffset = rangeOffset * rightScale;
    var newStart = Math.max(0, start - leftOffset);
    var newEnd = Math.min(1, end + rightOffset);
    var newRange = [newStart, newEnd]; // 如果已经到了最小比例，则不能再继续再放大

    if (newEnd - newStart < minScale) {
      return;
    }

    this.updateRange(newRange);
  }

  doMove(ratio) {
    // 不管是0， 还是其他，都不用处理
    if (!ratio) return;
    var {
      startRange: range
    } = this;
    var [start, end] = range;
    var rangeLen = end - start;
    var rangeOffset = rangeLen * ratio;
    var newStart = start - rangeOffset;
    var newEnd = end - rangeOffset; // 处理边界值

    var newRange;

    if (newStart < 0) {
      newRange = [0, rangeLen];
    } else if (newEnd > 1) {
      newRange = [1 - rangeLen, 1];
    } else {
      newRange = [newStart, newEnd];
    }

    this.updateRange(newRange);
  }

  updateRange(range) {
    var {
      values
    } = this; // 0， 1 的范围之间

    var [start, end] = range; // start 不能小于0

    start = Math.max(0, start); // end 不能大于1

    end = Math.min(1, end); // 设置当前的范围

    this.range = [start, end];
    var len = values.length;
    var valueStart = start * len;
    var valueEnd = end * len; // 从原始数据里截取需要显示的数据

    var newValues = values.slice(valueStart, valueEnd);
    this.repaint(newValues);
  }

  repaint(newValues) {
    var {
      chart
    } = this;
    var scale = this.getPinchScale();
    var {
      values: currentValues,
      ticks
    } = scale; // 如果新数组和当前显示的数组相同，则不更新

    if (isValuesEqual(currentValues, newValues)) {
      return;
    } // 更新主轴values


    this.updateScale(scale, {
      ticks,
      values: newValues
    });
    this.updateFollowScale(scale, newValues);
    chart.repaint();
  }

  updateFollowScale(pinchScale, pinchValues) {
    var {
      chart
    } = this;
    var followScale = this.getFollowScale();
    var {
      field: pinchField,
      type: pinchScaleType
    } = pinchScale;
    var {
      field: followField
    } = followScale; // 根据主轴的value值，找到所有从轴的value值

    var values = []; // 转成map，让查找性能更高

    var pinchValueMap = {};
    pinchValues.forEach(function (item) {
      pinchValueMap[item] = true;
    });
    var data = chart.get('data');
    data.forEach(function (item) {
      if (pinchScaleType === 'timeCat') {
        var value = toTimeStamp(item[pinchField]);

        if (pinchValueMap[value]) {
          values.push(item[followField]);
        }
      }
    });
    var {
      min,
      max
    } = getRange(values);
    this.updateScale(followScale, {
      min,
      max,
      nice: true
    });
  }

  updateScale(scale, cfg) {
    if (!scale) {
      return;
    }

    scale.change(cfg);
  } // 上一次的tick个数


  updateTicks() {
    var {
      chart,
      values
    } = this;
    var scale = this.getPinchScale();
    var {
      values: currentValues,
      tickCount
    } = scale; // 根据当前数据的比例，和定义的tickCount计算应该需要多少个ticks

    var newTickCount = Math.round(tickCount * values.length / currentValues.length);
    var catTicks = getTickMethod('cat');
    var ticks = catTicks({
      tickCount: newTickCount,
      values
    });
    this.updateScale(scale, {
      ticks,
      values: currentValues
    }); // 更新完后，需要重新绘制一次

    chart.repaint();
  }

  destroy() {
    var {
      chart
    } = this;
    chart.off(EVENT_AFTER_INIT, this._afterinit);
    chart.off(EVENT_AFTER_DATA_CHANGE, this._afterdatachange);
  }

}

export default Context;