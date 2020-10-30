import Shape from '../shape';
import { getBBoxFromPoints, getBBoxFromBezierGroup } from '../util/bbox';
import * as Smooth from '../util/smooth'; // filter the point which x or y is NaN

function _filterPoints(points) {
  var filteredPoints = [];

  for (var i = 0, len = points.length; i < len; i++) {
    var point = points[i];

    if (!isNaN(point.x) && !isNaN(point.y)) {
      filteredPoints.push(point);
    }
  }

  return filteredPoints;
}

class Polyline extends Shape {
  _initProperties() {
    super._initProperties();

    this._attrs.canFill = true;
    this._attrs.canStroke = true;
    this._attrs.type = 'polyline';
  }

  getDefaultAttrs() {
    return {
      points: null,
      lineWidth: 1,
      smooth: false
    };
  }

  createPath(context) {
    var self = this;
    var attrs = self.get('attrs');
    var {
      points,
      smooth
    } = attrs;

    var filteredPoints = _filterPoints(points);

    context.beginPath();

    if (filteredPoints.length) {
      context.moveTo(filteredPoints[0].x, filteredPoints[0].y);

      if (smooth) {
        var constaint = [[0, 0], [1, 1]];
        var sps = Smooth.smooth(filteredPoints, false, constaint);

        for (var i = 0, n = sps.length; i < n; i++) {
          var sp = sps[i];
          context.bezierCurveTo(sp[1], sp[2], sp[3], sp[4], sp[5], sp[6]);
        }
      } else {
        var _i;

        var l;

        for (_i = 1, l = filteredPoints.length - 1; _i < l; _i++) {
          context.lineTo(filteredPoints[_i].x, filteredPoints[_i].y);
        }

        context.lineTo(filteredPoints[l].x, filteredPoints[l].y);
      }
    }
  }

  calculateBox() {
    var attrs = this.get('attrs');
    var {
      points,
      smooth,
      lineWidth
    } = attrs;

    var filteredPoints = _filterPoints(points);

    if (smooth) {
      var newPoints = [];
      var constaint = [[0, 0], [1, 1]];
      var sps = Smooth.smooth(filteredPoints, false, constaint);

      for (var i = 0, n = sps.length; i < n; i++) {
        var sp = sps[i];

        if (i === 0) {
          newPoints.push([filteredPoints[0].x, filteredPoints[0].y, sp[1], sp[2], sp[3], sp[4], sp[5], sp[6]]);
        } else {
          var lastPoint = sps[i - 1];
          newPoints.push([lastPoint[5], lastPoint[6], sp[1], sp[2], sp[3], sp[4], sp[5], sp[6]]);
        }
      }

      return getBBoxFromBezierGroup(newPoints, lineWidth);
    }

    return getBBoxFromPoints(filteredPoints, lineWidth);
  }

}

Shape.Polyline = Polyline;
export default Polyline;