import Geom from './base';
import { splitArray } from './shape/util';
import { each } from '../util/common';
import './shape/line';

class Path extends Geom {
  getDefaultCfg() {
    var cfg = super.getDefaultCfg();
    cfg.type = 'path';
    cfg.shapeType = 'line';
    return cfg;
  }

  getDrawCfg(obj) {
    var cfg = super.getDrawCfg(obj);
    cfg.isStack = this.hasAdjust('stack');
    return cfg;
  }

  draw(data, shapeFactory) {
    var self = this;
    var container = self.get('container');
    var yScale = self.getYScale();
    var connectNulls = self.get('connectNulls');
    var splitArrayObj = splitArray(data, yScale.field, connectNulls);
    var cfg = this.getDrawCfg(data[0]);
    cfg.origin = data;
    each(splitArrayObj, function (subData, splitedIndex) {
      cfg.splitedIndex = splitedIndex;
      cfg.points = subData;
      self.drawShape(cfg.shape, data[0], cfg, container, shapeFactory);
    });
  }

}

Geom.Path = Path;
export default Path;