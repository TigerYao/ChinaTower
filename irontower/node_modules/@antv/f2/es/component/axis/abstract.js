import { mix, each, isFunction } from '../../util/common';
import Global from '../../global';
import Vector2 from '../../graphic/util/vector2';

class Abastract {
  _initDefaultCfg() {
    /**
     * ticks
     * @type {Array}
     */
    this.ticks = [];
    /**
     * the configuration for tickLine
     * @type {Object}
     */

    this.tickLine = {};
    /**
     * the direction of ticks, 1 means clockwise
     * @type {Number}
     */

    this.offsetFactor = 1;
    /**
     * the top container
     * @type {container}
     */

    this.frontContainer = null;
    /**
     * the back container
     * @type {[type]}
     */

    this.backContainer = null;
    /**
     * points for draw grid line
     * @type {Array}
     */

    this.gridPoints = [];
  }

  constructor(cfg) {
    this._initDefaultCfg();

    mix(this, cfg);
    this.draw();
  }

  draw() {
    var {
      line,
      tickLine,
      label,
      grid
    } = this;
    grid && this.drawGrid(grid); // draw the grid lines

    tickLine && this.drawTicks(tickLine); // draw the tickLine

    line && this.drawLine(line); // draw axis line

    label && this.drawLabels(); // draw ticks
  }

  drawTicks(tickCfg) {
    var self = this;
    var ticks = self.ticks;
    var length = tickCfg.length;
    var container = self.getContainer(tickCfg.top);
    each(ticks, function (tick) {
      var start = self.getOffsetPoint(tick.value);
      var end = self.getSidePoint(start, length);
      var shape = container.addShape('line', {
        className: 'axis-tick',
        attrs: mix({
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y
        }, tickCfg)
      });
      shape._id = self._id + '-ticks';
    });
  }

  drawLabels() {
    var self = this;
    var labelOffset = self.labelOffset;
    var labels = self.labels;
    each(labels, function (labelShape) {
      var container = self.getContainer(labelShape.get('top'));
      var start = self.getOffsetPoint(labelShape.get('value'));
      var {
        x,
        y
      } = self.getSidePoint(start, labelOffset);
      labelShape.attr(mix({
        x,
        y
      }, self.getTextAlignInfo(start, labelOffset), labelShape.get('textStyle')));
      labelShape._id = self._id + '-' + labelShape.attr('text');
      container.add(labelShape);
    });
  }

  drawLine() {}

  drawGrid(grid) {
    var self = this;
    var {
      gridPoints,
      ticks
    } = self;
    var gridCfg = grid;
    var count = gridPoints.length;
    each(gridPoints, function (subPoints, index) {
      if (isFunction(grid)) {
        var tick = ticks[index] || {};
        var executedGrid = grid(tick.text, index, count);
        gridCfg = executedGrid ? mix({}, Global._defaultAxis.grid, executedGrid) : null;
      }

      if (gridCfg) {
        var type = gridCfg.type; // has two types: 'line' and 'arc'

        var points = subPoints.points;
        var container = self.getContainer(gridCfg.top);
        var shape;

        if (type === 'arc') {
          var {
            center,
            startAngle,
            endAngle
          } = self;
          var radius = Vector2.length([points[0].x - center.x, points[0].y - center.y]);
          shape = container.addShape('Arc', {
            className: 'axis-grid',
            attrs: mix({
              x: center.x,
              y: center.y,
              startAngle,
              endAngle,
              r: radius
            }, gridCfg)
          });
        } else {
          shape = container.addShape('Polyline', {
            className: 'axis-grid',
            attrs: mix({
              points
            }, gridCfg)
          });
        }

        shape._id = subPoints._id;
      }
    });
  }

  getOffsetPoint() {}

  getAxisVector() {}

  getOffsetVector(point, offset) {
    var self = this;
    var axisVector = self.getAxisVector(point);
    var normal = Vector2.normalize([], axisVector);
    var factor = self.offsetFactor;
    var verticalVector = [normal[1] * -1 * factor, normal[0] * factor];
    return Vector2.scale([], verticalVector, offset);
  }

  getSidePoint(point, offset) {
    var self = this;
    var offsetVector = self.getOffsetVector(point, offset);
    return {
      x: point.x + offsetVector[0],
      y: point.y + offsetVector[1]
    };
  }

  getTextAlignInfo(point, offset) {
    var self = this;
    var offsetVector = self.getOffsetVector(point, offset);
    var align;
    var baseLine;

    if (offsetVector[0] > 0) {
      align = 'left';
    } else if (offsetVector[0] < 0) {
      align = 'right';
    } else {
      align = 'center';
    }

    if (offsetVector[1] > 0) {
      baseLine = 'top';
    } else if (offsetVector[1] < 0) {
      baseLine = 'bottom';
    } else {
      baseLine = 'middle';
    }

    return {
      textAlign: align,
      textBaseline: baseLine
    };
  }

  getContainer(isTop) {
    var {
      frontContainer,
      backContainer
    } = this;
    return isTop ? frontContainer : backContainer;
  }

}

export default Abastract;