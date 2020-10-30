"use strict";

exports.__esModule = true;
exports.splitPoints = splitPoints;
exports.splitArray = splitArray;

var _common = require("../../util/common");

/**
 * @fileOverview shape util
 * @author dxq613@gmail.com
 */
function splitPoints(obj) {
  var points = [];
  var x = obj.x;
  var y = obj.y;
  y = (0, _common.isArray)(y) ? y : [y];
  y.forEach(function (yItem, index) {
    var point = {
      x: (0, _common.isArray)(x) ? x[index] : x,
      y: yItem
    };
    points.push(point);
  });
  return points;
}

function splitArray(data, yField, connectNulls) {
  if (!data.length) return [];
  var arr = [];
  var tmp = [];
  var yValue;
  (0, _common.each)(data, function (obj) {
    yValue = obj._origin ? obj._origin[yField] : obj[yField];

    if (connectNulls) {
      if (!(0, _common.isNil)(yValue)) {
        tmp.push(obj);
      }
    } else {
      if ((0, _common.isArray)(yValue) && (0, _common.isNil)(yValue[0]) || (0, _common.isNil)(yValue)) {
        if (tmp.length) {
          arr.push(tmp);
          tmp = [];
        }
      } else {
        tmp.push(obj);
      }
    }
  });

  if (tmp.length) {
    arr.push(tmp);
  }

  return arr;
}