"use strict";

exports.__esModule = true;
exports.smooth = catmullRom2bezier;

var _vector = _interopRequireDefault(require("./vector2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @fileOverview convert the line to curve
 * @author dxq613@gmail.com
 */
function getPoint(v) {
  return [v.x, v.y];
}

function smoothBezier(points, smooth, isLoop, constraint) {
  var cps = [];
  var prevPoint;
  var nextPoint;
  var hasConstraint = !!constraint;
  var min;
  var max;
  var point;
  var len;
  var l;
  var i;

  if (hasConstraint) {
    min = [Infinity, Infinity];
    max = [-Infinity, -Infinity];

    for (i = 0, l = points.length; i < l; i++) {
      point = getPoint(points[i]);

      _vector["default"].min(min, min, point);

      _vector["default"].max(max, max, point);
    }

    _vector["default"].min(min, min, constraint[0]);

    _vector["default"].max(max, max, constraint[1]);
  }

  for (i = 0, len = points.length; i < len; i++) {
    point = getPoint(points[i]);

    if (isLoop) {
      prevPoint = getPoint(points[i ? i - 1 : len - 1]);
      nextPoint = getPoint(points[(i + 1) % len]);
    } else {
      if (i === 0 || i === len - 1) {
        cps.push([point[0], point[1]]);
        continue;
      } else {
        prevPoint = getPoint(points[i - 1]);
        nextPoint = getPoint(points[i + 1]);
      }
    }

    var v = _vector["default"].sub([], nextPoint, prevPoint);

    _vector["default"].scale(v, v, smooth);

    var d0 = _vector["default"].distance(point, prevPoint);

    var d1 = _vector["default"].distance(point, nextPoint);

    var sum = d0 + d1;

    if (sum !== 0) {
      d0 /= sum;
      d1 /= sum;
    }

    var v1 = _vector["default"].scale([], v, -d0);

    var v2 = _vector["default"].scale([], v, d1);

    var cp0 = _vector["default"].add([], point, v1);

    var cp1 = _vector["default"].add([], point, v2);

    if (hasConstraint) {
      _vector["default"].max(cp0, cp0, min);

      _vector["default"].min(cp0, cp0, max);

      _vector["default"].max(cp1, cp1, min);

      _vector["default"].min(cp1, cp1, max);
    }

    cps.push([cp0[0], cp0[1]]);
    cps.push([cp1[0], cp1[1]]);
  }

  if (isLoop) {
    cps.push(cps.shift());
  }

  return cps;
}

function catmullRom2bezier(pointList, z, constraint) {
  var isLoop = !!z;
  var controlPointList = smoothBezier(pointList, 0.4, isLoop, constraint);
  var len = pointList.length;
  var d1 = [];
  var cp1;
  var cp2;
  var p;

  for (var i = 0; i < len - 1; i++) {
    cp1 = controlPointList[i * 2];
    cp2 = controlPointList[i * 2 + 1];
    p = pointList[i + 1];
    d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p.x, p.y]);
  }

  if (isLoop) {
    cp1 = controlPointList[len];
    cp2 = controlPointList[len + 1];
    p = pointList[0];
    d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p.x, p.y]);
  }

  return d1;
}