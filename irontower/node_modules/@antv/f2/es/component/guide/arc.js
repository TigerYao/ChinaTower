import { mix } from '../../util/common';
import GuideBase from './base';

class Arc extends GuideBase {
  _initDefaultCfg() {
    this.type = 'arc';
    /**
     * start point
     * @type {Array | Function}
     */

    this.start = [];
    /**
     * end point
     * @type {Array | Function}
     */

    this.end = [];
    /**
     * style configuration
     * @type {Object}
     */

    this.style = {
      stroke: '#999',
      lineWidth: 1
    };
  }

  render(coord, container) {
    var self = this;
    var start = self.parsePoint(coord, self.start);
    var end = self.parsePoint(coord, self.end);

    if (!start || !end) {
      return;
    }

    var coordCenter = coord.center;
    var radius = Math.sqrt((start.x - coordCenter.x) * (start.x - coordCenter.x) + (start.y - coordCenter.y) * (start.y - coordCenter.y));
    var startAngle = Math.atan2(start.y - coordCenter.y, start.x - coordCenter.x);
    var endAngle = Math.atan2(end.y - coordCenter.y, end.x - coordCenter.x);
    var shape = container.addShape('arc', {
      className: 'guide-arc',
      attrs: mix({
        x: coordCenter.x,
        y: coordCenter.y,
        r: radius,
        startAngle,
        endAngle
      }, self.style)
    });
    self.element = shape;
    return shape;
  }

}

GuideBase.Arc = Arc;
export default Arc;