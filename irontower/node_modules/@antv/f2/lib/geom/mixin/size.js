"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _const = require("../../chart/const");

var _common = require("../../util/common");

var _global = _interopRequireDefault(require("../../global"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @fileOverview Utility for calculate the with ratui in x axis
 * @author sima.zhang1990@gmail.com
 * @author dxq613@gmail.com
 */
var SizeMixin = {
  initEvent: function initEvent() {
    var _this = this;

    var chart = this.get('chart');

    if (!chart) {
      return;
    }

    chart.on(_const.EVENT_AFTER_SIZE_CHANGE, function () {
      _this.set('_width', null);
    });
  },
  getDefaultSize: function getDefaultSize() {
    var defaultSize = this.get('defaultSize');

    if (!defaultSize) {
      var coord = this.get('coord');
      var xScale = this.getXScale();
      var dataArray = this.get('dataArray');
      var values = (0, _common.uniq)(xScale.values);
      var count = values.length;
      var range = xScale.range;
      var normalizeSize = 1 / count;
      var widthRatio = 1;

      if (coord && coord.isPolar) {
        if (coord.transposed && count > 1) {
          widthRatio = _global["default"].widthRatio.multiplePie;
        } else {
          widthRatio = _global["default"].widthRatio.rose;
        }
      } else {
        if (xScale.isLinear) {
          normalizeSize *= range[1] - range[0];
        }

        widthRatio = _global["default"].widthRatio.column;
      }

      normalizeSize *= widthRatio;

      if (this.hasAdjust('dodge')) {
        normalizeSize = normalizeSize / dataArray.length;
      }

      defaultSize = normalizeSize;
      this.set('defaultSize', defaultSize);
    }

    return defaultSize;
  },
  getDimWidth: function getDimWidth(dimName) {
    var coord = this.get('coord');
    var start = coord.convertPoint({
      x: 0,
      y: 0
    });
    var end = coord.convertPoint({
      x: dimName === 'x' ? 1 : 0,
      y: dimName === 'x' ? 0 : 1
    });
    var width = 0;

    if (start && end) {
      width = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    }

    return width;
  },
  _getWidth: function _getWidth() {
    var width = this.get('_width');

    if (!width) {
      var coord = this.get('coord');

      if (coord && coord.isPolar && !coord.transposed) {
        width = (coord.endAngle - coord.startAngle) * coord.circleRadius;
      } else {
        width = this.getDimWidth('x');
      }

      this.set('_width', width);
    }

    return width;
  },
  _toNormalizedSize: function _toNormalizedSize(size) {
    var width = this._getWidth();

    return size / width;
  },
  _toCoordSize: function _toCoordSize(normalizeSize) {
    var width = this._getWidth();

    return width * normalizeSize;
  },
  getNormalizedSize: function getNormalizedSize(obj) {
    var size = this.getAttrValue('size', obj);

    if ((0, _common.isNil)(size)) {
      size = this.getDefaultSize();
    } else {
      size = this._toNormalizedSize(size);
    }

    return size;
  },
  getSize: function getSize(obj) {
    var size = this.getAttrValue('size', obj);

    if ((0, _common.isNil)(size)) {
      var normalizeSize = this.getDefaultSize();
      size = this._toCoordSize(normalizeSize);
    }

    return size;
  }
};
var _default = SizeMixin;
exports["default"] = _default;