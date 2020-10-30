import { deepMix, isNil, isFunction, isString } from '../../util/common';
var KEYWORDS_PERCENT = {
  min: 0,
  median: 0.5,
  max: 1
};

class GuideBase {
  _initDefaultCfg() {}

  constructor(cfg) {
    this._initDefaultCfg();

    deepMix(this, cfg);
  }

  _getNormalizedValue(val, scale) {
    var rst;

    if (isNil(KEYWORDS_PERCENT[val])) {
      rst = scale.scale(val);
    } else {
      rst = KEYWORDS_PERCENT[val];
    }

    return rst;
  }

  parsePercentPoint(coord, position) {
    var xPercent = parseFloat(position[0]) / 100;
    var yPercent = parseFloat(position[1]) / 100;
    var start = coord.start;
    var end = coord.end;
    var width = Math.abs(start.x - end.x);
    var height = Math.abs(start.y - end.y);
    var x = width * xPercent + Math.min(start.x, end.x);
    var y = height * yPercent + Math.min(start.y, end.y);
    return {
      x,
      y
    };
  }

  parsePoint(coord, position) {
    var self = this;
    var xScale = self.xScale;
    var yScales = self.yScales;

    if (isFunction(position)) {
      position = position(xScale, yScales); // position 必须是对象
    } // 如果数据格式是 ['50%', '50%'] 的格式
    // fix: 原始数据中可能会包含 'xxx5%xxx' 这样的数据，需要判断下 https://github.com/antvis/f2/issues/590


    if (isString(position[0]) && position[0].indexOf('%') !== -1 && !isNaN(position[0].slice(0, -1))) {
      return this.parsePercentPoint(coord, position);
    }

    var x = self._getNormalizedValue(position[0], xScale);

    var y = self._getNormalizedValue(position[1], yScales[0]);

    var point = coord.convertPoint({
      x,
      y
    });

    if (self.limitInPlot) {
      // limit in chart plotRange
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        return point;
      }

      return null;
    }

    return point;
  }
  /**
   * render the guide component
   * @param  {Coord} coord  coordinate instance
   * @param  {Canvas.Group} group the container
   */


  render()
  /* coord,group */
  {}

  repaint() {
    this.remove();
    var {
      coord,
      container,
      canvas
    } = this;

    if (container && !container.isDestroyed()) {
      this.render(coord, container);
      canvas.draw();
    }
  }

  remove() {
    var {
      element
    } = this;
    element && element.remove(true);
  }

  changeVisible(visible) {
    var self = this;
    self.visible = visible;
    var element = self.element;
    if (!element) return;

    if (element.set) {
      element.set('visible', visible);
    } else {
      element.style.display = visible ? '' : 'none';
    }
  }

}

export default GuideBase;