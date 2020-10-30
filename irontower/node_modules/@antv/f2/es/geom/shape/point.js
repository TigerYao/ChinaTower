import Global from '../../global';
import Shape from './shape';
import { mix, each, isArray } from '../../util/common';
import { splitPoints } from './util';
var SHAPES = ['circle', 'hollowCircle', 'rect'];
var Point = Shape.registerFactory('point', {
  defaultShapeType: 'circle',

  getDefaultPoints(pointInfo) {
    return splitPoints(pointInfo);
  }

});

function getPointsCfg(cfg) {
  var style = {
    lineWidth: 0,
    stroke: cfg.color,
    fill: cfg.color
  };

  if (cfg.size) {
    style.size = cfg.size;
  }

  mix(style, cfg.style);
  return mix({}, Global.shape.point, style);
}

function drawShape(cfg, container, shape) {
  if (cfg.size === 0) return;
  var pointCfg = getPointsCfg(cfg);
  var size = pointCfg.r || pointCfg.size;
  var x = cfg.x;
  var y = !isArray(cfg.y) ? [cfg.y] : cfg.y;

  if (shape === 'hollowCircle') {
    pointCfg.lineWidth = 1;
    pointCfg.fill = null;
  }

  for (var i = 0, len = y.length; i < len; i++) {
    if (shape === 'rect') {
      return container.addShape('Rect', {
        className: 'point',
        attrs: mix({
          x: x - size,
          y: y[i] - size,
          width: size * 2,
          height: size * 2
        }, pointCfg)
      });
    }

    return container.addShape('Circle', {
      className: 'point',
      attrs: mix({
        x,
        y: y[i],
        r: size
      }, pointCfg)
    });
  }
}

each(SHAPES, function (shapeType) {
  Shape.registerShape('point', shapeType, {
    draw(cfg, container) {
      return drawShape(cfg, container, shapeType);
    }

  });
});
export default Point;