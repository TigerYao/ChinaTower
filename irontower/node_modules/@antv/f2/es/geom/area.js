/**
 * @fileOverview area geometry
 * @author dxq613 @gmail.com
 * @author sima.zhang1990@gmail.com
 */
import Geom from './base';
import { splitArray } from './shape/util';
import { each } from '../util/common';
import './shape/area';

class Area extends Geom {
  /**
   * get the default configuration
   * @protected
   * @return {Object} return the result
   */
  getDefaultCfg() {
    var cfg = super.getDefaultCfg();
    cfg.type = 'area';
    cfg.shapeType = 'area';
    cfg.generatePoints = true;
    cfg.sortable = true;
    return cfg;
  }

  draw(data, shapeFactory) {
    var self = this;
    var container = self.get('container');
    var cfg = this.getDrawCfg(data[0]);
    var yScale = self.getYScale();
    var connectNulls = self.get('connectNulls');
    var splitArrayfn = splitArray(data, yScale.field, connectNulls);
    cfg.origin = data;
    each(splitArrayfn, function (subData, splitedIndex) {
      cfg.splitedIndex = splitedIndex;
      var points = subData.map(function (obj) {
        return obj.points;
      });
      cfg.points = points;
      self.drawShape(cfg.shape, data[0], cfg, container, shapeFactory);
    });
  }

}

Geom.Area = Area;
export default Area;