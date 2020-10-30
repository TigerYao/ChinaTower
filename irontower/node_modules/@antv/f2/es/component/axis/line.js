import { mix } from '../../util/common';
import Abstract from './abstract';

class Line extends Abstract {
  _initDefaultCfg() {
    super._initDefaultCfg();

    this.start = null;
    this.end = null;
  }

  getOffsetPoint(value) {
    var {
      start,
      end
    } = this;
    return {
      x: start.x + (end.x - start.x) * value,
      y: start.y + (end.y - start.y) * value
    };
  }

  getAxisVector() {
    var {
      start,
      end
    } = this;
    return [end.x - start.x, end.y - start.y];
  }

  drawLine(lineCfg) {
    var container = this.getContainer(lineCfg.top);
    var {
      start,
      end
    } = this;
    container.addShape('line', {
      className: 'axis-line',
      attrs: mix({
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y
      }, lineCfg)
    });
  }

}

Abstract.Line = Line;
export default Line;