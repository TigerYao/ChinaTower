import Global from '../../global';
import Shape from './shape';
import { mix, each, isArray } from '../../util/common';
import { splitPoints } from './util'; // register line geom

var Line = Shape.registerFactory('line', {
  defaultShapeType: 'line'
});

function getStyle(cfg) {
  var style = {
    strokeStyle: cfg.color
  };

  if (cfg.size >= 0) {
    style.lineWidth = cfg.size;
  }

  mix(style, cfg.style);
  return mix({}, Global.shape.line, style);
}

function drawLines(cfg, container, style, smooth) {
  var points = cfg.points;

  if (points.length && isArray(points[0].y)) {
    var topPoints = [];
    var bottomPoints = [];

    for (var i = 0, len = points.length; i < len; i++) {
      var point = points[i];
      var tmp = splitPoints(point);
      bottomPoints.push(tmp[0]);
      topPoints.push(tmp[1]);
    }

    if (cfg.isInCircle) {
      topPoints.push(topPoints[0]);
      bottomPoints.push(bottomPoints[0]);
    }

    if (cfg.isStack) {
      return container.addShape('Polyline', {
        className: 'line',
        attrs: mix({
          points: topPoints,
          smooth
        }, style)
      });
    }

    var topShape = container.addShape('Polyline', {
      className: 'line',
      attrs: mix({
        points: topPoints,
        smooth
      }, style)
    });
    var bottomShape = container.addShape('Polyline', {
      className: 'line',
      attrs: mix({
        points: bottomPoints,
        smooth
      }, style)
    });
    return [topShape, bottomShape];
  }

  if (cfg.isInCircle) {
    points.push(points[0]);
  }

  return container.addShape('Polyline', {
    className: 'line',
    attrs: mix({
      points,
      smooth
    }, style)
  });
}

var SHAPES = ['line', 'smooth', 'dash'];
each(SHAPES, function (shapeType) {
  Shape.registerShape('line', shapeType, {
    draw(cfg, container) {
      var smooth = shapeType === 'smooth';
      var style = getStyle(cfg);

      if (shapeType === 'dash') {
        style.lineDash = Global.lineDash;
      }

      return drawLines(cfg, container, style, smooth);
    }

  });
});
export default Line;