"use strict";

exports.__esModule = true;
exports.getCoordInfo = getCoordInfo;
exports.getScaledMatrix = getScaledMatrix;
exports.getAnimateParam = getAnimateParam;
exports.doAnimation = doAnimation;

var _index = require("../graphic/index");

var _common = require("../util/common");

/**
 * Utility
 * @author sima.zhang1990@gmail.com
 */
function getCoordInfo(coord) {
  var start = coord.start;
  var end = coord.end;
  return {
    start: start,
    end: end,
    width: end.x - start.x,
    height: Math.abs(end.y - start.y)
  };
}

function getScaledMatrix(shape, v, direct) {
  var scaledMatrix;
  shape.apply(v);
  var x = v[0];
  var y = v[1];

  if (direct === 'x') {
    shape.transform([['t', x, y], ['s', 0.01, 1], ['t', -x, -y]]);
    var matrix = shape.getMatrix();
    scaledMatrix = _index.Matrix.transform(matrix, [['t', x, y], ['s', 100, 1], ['t', -x, -y]]);
  } else if (direct === 'y') {
    shape.transform([['t', x, y], ['s', 1, 0.01], ['t', -x, -y]]);

    var _matrix = shape.getMatrix();

    scaledMatrix = _index.Matrix.transform(_matrix, [['t', x, y], ['s', 1, 100], ['t', -x, -y]]);
  } else if (direct === 'xy') {
    shape.transform([['t', x, y], ['s', 0.01, 0.01], ['t', -x, -y]]);

    var _matrix2 = shape.getMatrix();

    scaledMatrix = _index.Matrix.transform(_matrix2, [['t', x, y], ['s', 100, 100], ['t', -x, -y]]);
  }

  return scaledMatrix;
}

function getAnimateParam(animateCfg, index, id) {
  var result = {};

  if (animateCfg.delay) {
    result.delay = (0, _common.isFunction)(animateCfg.delay) ? animateCfg.delay(index, id) : animateCfg.delay;
  }

  result.easing = animateCfg.easing;
  result.duration = animateCfg.duration;
  result.delay = animateCfg.delay;
  return result;
}

function doAnimation(shape, endState, animateCfg, callback) {
  var id = shape._id;
  var index = shape.get('index');

  var _getAnimateParam = getAnimateParam(animateCfg, index, id),
      easing = _getAnimateParam.easing,
      delay = _getAnimateParam.delay,
      duration = _getAnimateParam.duration;

  var anim = shape.animate().to({
    attrs: endState,
    duration: duration,
    delay: delay,
    easing: easing
  });

  if (callback) {
    anim.onEnd(function () {
      callback();
    });
  }
}