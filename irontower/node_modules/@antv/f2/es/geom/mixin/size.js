/**
 * @fileOverview Utility for calculate the with ratui in x axis
 * @author sima.zhang1990@gmail.com
 * @author dxq613@gmail.com
 */
import { EVENT_AFTER_SIZE_CHANGE } from '../../chart/const';
import { uniq, isNil } from '../../util/common';
import Global from '../../global';
var SizeMixin = {
  initEvent() {
    var _this = this;

    var chart = this.get('chart');

    if (!chart) {
      return;
    }

    chart.on(EVENT_AFTER_SIZE_CHANGE, function () {
      _this.set('_width', null);
    });
  },

  getDefaultSize() {
    var defaultSize = this.get('defaultSize');

    if (!defaultSize) {
      var coord = this.get('coord');
      var xScale = this.getXScale();
      var dataArray = this.get('dataArray');
      var values = uniq(xScale.values);
      var count = values.length;
      var range = xScale.range;
      var normalizeSize = 1 / count;
      var widthRatio = 1;

      if (coord && coord.isPolar) {
        if (coord.transposed && count > 1) {
          widthRatio = Global.widthRatio.multiplePie;
        } else {
          widthRatio = Global.widthRatio.rose;
        }
      } else {
        if (xScale.isLinear) {
          normalizeSize *= range[1] - range[0];
        }

        widthRatio = Global.widthRatio.column;
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

  getDimWidth(dimName) {
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

  _getWidth() {
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

  _toNormalizedSize(size) {
    var width = this._getWidth();

    return size / width;
  },

  _toCoordSize(normalizeSize) {
    var width = this._getWidth();

    return width * normalizeSize;
  },

  getNormalizedSize(obj) {
    var size = this.getAttrValue('size', obj);

    if (isNil(size)) {
      size = this.getDefaultSize();
    } else {
      size = this._toNormalizedSize(size);
    }

    return size;
  },

  getSize(obj) {
    var size = this.getAttrValue('size', obj);

    if (isNil(size)) {
      var normalizeSize = this.getDefaultSize();
      size = this._toCoordSize(normalizeSize);
    }

    return size;
  }

};
export default SizeMixin;