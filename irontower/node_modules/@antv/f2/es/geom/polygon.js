import Geom from './base';
import { isArray } from '../util/common';
import './shape/polygon';

class Polygon extends Geom {
  getDefaultCfg() {
    var cfg = super.getDefaultCfg();
    cfg.type = 'polygon';
    cfg.shapeType = 'polygon';
    cfg.generatePoints = true;
    return cfg;
  }

  createShapePointsCfg(obj) {
    var cfg = super.createShapePointsCfg(obj);
    var self = this;
    var x = cfg.x;
    var y = cfg.y;
    var temp;

    if (!(isArray(x) && isArray(y))) {
      var xScale = self.getXScale();
      var yScale = self.getYScale();
      var xCount = xScale.values ? xScale.values.length : xScale.ticks.length;
      var yCount = yScale.values ? yScale.values.length : yScale.ticks.length;
      var xOffset = 0.5 * 1 / xCount;
      var yOffset = 0.5 * 1 / yCount;

      if (xScale.isCategory && yScale.isCategory) {
        x = [x - xOffset, x - xOffset, x + xOffset, x + xOffset];
        y = [y - yOffset, y + yOffset, y + yOffset, y - yOffset];
      } else if (isArray(x)) {
        temp = x;
        x = [temp[0], temp[0], temp[1], temp[1]];
        y = [y - yOffset / 2, y + yOffset / 2, y + yOffset / 2, y - yOffset / 2];
      } else if (isArray(y)) {
        temp = y;
        y = [temp[0], temp[1], temp[1], temp[0]];
        x = [x - xOffset / 2, x - xOffset / 2, x + xOffset / 2, x + xOffset / 2];
      }

      cfg.x = x;
      cfg.y = y;
    }

    return cfg;
  }

}

Geom.Polygon = Polygon;
export default Polygon;