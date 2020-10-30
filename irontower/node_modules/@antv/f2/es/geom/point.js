import { each, isArray, isNil } from '../util/common';
import Geom from './base';
import './shape/point';

class Point extends Geom {
  getDefaultCfg() {
    var cfg = super.getDefaultCfg();
    cfg.type = 'point';
    cfg.shapeType = 'point';
    cfg.generatePoints = false;
    return cfg;
  }

  draw(data, shapeFactory) {
    var self = this;
    var container = self.get('container');
    each(data, function (obj) {
      var shape = obj.shape;
      var cfg = self.getDrawCfg(obj);

      if (isArray(obj.y)) {
        var hasStack = self.hasAdjust('stack');
        each(obj.y, function (y, idx) {
          cfg.y = y;

          if (!hasStack || idx !== 0) {
            self.drawShape(shape, obj, cfg, container, shapeFactory);
          }
        });
      } else if (!isNil(obj.y)) {
        self.drawShape(shape, obj, cfg, container, shapeFactory);
      }
    });
  }

}

Geom.Point = Point;
export default Point;