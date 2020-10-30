import Shape from './shape';
import { mix } from '../../util/common';
var Polygon = Shape.registerFactory('polygon', {
  defaultShapeType: 'polygon',

  getDefaultPoints(pointInfo) {
    var points = [];
    var {
      x,
      y
    } = pointInfo;

    for (var i = 0, len = x.length; i < len; i++) {
      points.push({
        x: x[i],
        y: y[i]
      });
    }

    return points;
  }

});
Shape.registerShape('polygon', 'polygon', {
  draw(cfg, container) {
    var points = this.parsePoints(cfg.points);
    var style = mix({
      fill: cfg.color,
      points
    }, cfg.style);
    return container.addShape('Polygon', {
      className: 'polygon',
      attrs: style
    });
  }

});
export default Polygon;