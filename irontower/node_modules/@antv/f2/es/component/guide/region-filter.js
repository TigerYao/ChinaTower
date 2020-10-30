import Rect from '../../graphic/shape/rect';
import { mix, each } from '../../util/common';
import GuideBase from './base';

class RegionFilter extends GuideBase {
  _initDefaultCfg() {
    this.type = 'regionFilter';
    this.start = [];
    this.end = [];
    this.color = null;
    this.style = null;
  }

  render(coord) {
    var start = this.parsePoint(coord, this.start);
    var end = this.parsePoint(coord, this.end);

    if (!start || !end) {
      return;
    }

    var clip = new Rect({
      attrs: {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y)
      }
    }); // 新建剪切区域

    this.clip = clip;
    var chart = this.chart;
    var color = this.color;
    var style = this.style || {};
    var regionElements = [];
    var geoms = chart.get('geoms');
    geoms.map(function (geom) {
      var geomContainer = geom.get('container');
      var children = geomContainer.get('children');
      var group = geomContainer.addGroup({
        zIndex: 10,
        className: 'guide-region-filter'
      });
      children.map(function (c) {
        if (c.get('isShape')) {
          var type = c.get('type');
          var attrs = mix({}, c.get('attrs'), style);

          if (color && (attrs.fill || attrs.fillStyle)) {
            attrs.fill = attrs.fillStyle = color;
          }

          if (color && (attrs.stroke || attrs.strokeStyle)) {
            attrs.stroke = attrs.strokeStyle = color;
          }

          var cfg = {
            attrs
          };

          if (type === 'custom' || type === 'Custom') {
            // custom 类型的 shape 会自定义绘制 path 的逻辑
            cfg.createPath = c.get('createPath');
            cfg.calculateBox = c.get('calculateBox');
          }

          group.addShape(type, cfg);
        }

        return c;
      });
      group.attr('clip', clip);
      geomContainer.sort();
      regionElements.push(group);
      return geom;
    });
    this.element = regionElements;
  }

  remove() {
    var element = this.element;
    each(element, function (group) {
      group && group.remove(true);
    });
    this.clip && this.clip.remove(true);
  }

}

GuideBase.RegionFilter = RegionFilter;
export default RegionFilter;