import { Shape } from '../graphic/index';

function getClip(coord) {
  var start = coord.start;
  var end = coord.end;
  var width = end.x - start.x;
  var height = Math.abs(end.y - start.y);
  var margin = 10;
  var clip;

  if (coord.isPolar) {
    var {
      circleRadius,
      center,
      startAngle,
      endAngle
    } = coord;
    clip = new Shape.Sector({
      attrs: {
        x: center.x,
        y: center.y,
        r: circleRadius,
        r0: 0,
        startAngle,
        endAngle
      }
    });
  } else {
    clip = new Shape.Rect({
      attrs: {
        x: start.x,
        y: end.y - margin,
        width,
        height: height + 2 * margin
      }
    });
  }

  clip.isClip = true;
  return clip;
}

function isPointInPlot(point, plot) {
  var {
    x,
    y
  } = point;
  var {
    tl,
    tr,
    br
  } = plot;
  return x >= tl.x && x <= tr.x && y >= tl.y && y <= br.y;
}

export { getClip, isPointInPlot };