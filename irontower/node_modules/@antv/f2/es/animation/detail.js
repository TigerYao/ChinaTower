/**
 * Handle the detail animations
 * @author sima.zhang1990@gmail.com
 */
import { mix, isArray, isNumber, each, isNil, isFunction, isString, isObject, deepMix } from '../util/common';
import Element from '../graphic/element';
import Timeline from '../graphic/animate/timeline';
import Animator from '../graphic/animate/animator';
import Animate from './animate';
import * as ShapeAction from './shape-action';
import * as GroupAction from './group-action';
import Chart from '../chart/chart';
var timeline;

Element.prototype.animate = function () {
  var attrs = mix({}, this.get('attrs'));
  return new Animator(this, attrs, timeline);
};

Chart.prototype.animate = function (cfg) {
  this.set('animate', cfg);
  return this;
};

Animate.Action = ShapeAction;
Animate.defaultCfg = {
  interval: {
    enter(coord) {
      if (coord.isPolar && coord.transposed) {
        // for pie chart
        return function (shape) {
          shape.set('zIndex', -1);
          var container = shape.get('parent');
          container.sort();
        };
      }

      return ShapeAction.fadeIn;
    }

  },
  area: {
    enter(coord) {
      if (coord.isPolar) return null;
      return ShapeAction.fadeIn;
    }

  },
  line: {
    enter(coord) {
      if (coord.isPolar) return null;
      return ShapeAction.fadeIn;
    }

  },
  path: {
    enter(coord) {
      if (coord.isPolar) return null;
      return ShapeAction.fadeIn;
    }

  }
};
var GROUP_ANIMATION = {
  line(coord) {
    if (coord.isPolar) {
      return GroupAction.groupScaleInXY;
    }

    return GroupAction.groupWaveIn;
  },

  area(coord) {
    if (coord.isPolar) {
      return GroupAction.groupScaleInXY;
    }

    return GroupAction.groupWaveIn;
  },

  path(coord) {
    if (coord.isPolar) {
      return GroupAction.groupScaleInXY;
    }

    return GroupAction.groupWaveIn;
  },

  point() {
    return GroupAction.shapesScaleInXY;
  },

  interval(coord) {
    var result;

    if (coord.isPolar) {
      // polar coodinate
      result = GroupAction.groupScaleInXY;

      if (coord.transposed) {
        // pie chart
        result = GroupAction.groupWaveIn;
      }
    } else {
      result = coord.transposed ? GroupAction.groupScaleInX : GroupAction.groupScaleInY;
    }

    return result;
  },

  schema() {
    return GroupAction.groupWaveIn;
  }

};

function diff(fromAttrs, toAttrs) {
  var endState = {};

  for (var k in toAttrs) {
    if (isNumber(fromAttrs[k]) && fromAttrs[k] !== toAttrs[k]) {
      endState[k] = toAttrs[k];
    } else if (isArray(fromAttrs[k]) && JSON.stringify(fromAttrs[k]) !== JSON.stringify(toAttrs[k])) {
      endState[k] = toAttrs[k];
    }
  }

  return endState;
} // Add a unique id identifier to each shape


function _getShapeId(geom, dataObj, geomIdx) {
  var type = geom.get('type');
  var id = 'geom' + geomIdx + '-' + type;
  var xScale = geom.getXScale();
  var yScale = geom.getYScale();
  var xField = xScale.field || 'x';
  var yField = yScale.field || 'y';
  var yVal = dataObj[yField];
  var xVal;

  if (xScale.isIdentity) {
    xVal = xScale.value;
  } else {
    xVal = dataObj[xField];
  }

  if (type === 'interval' || type === 'schema') {
    id += '-' + xVal;
  } else if (type === 'line' || type === 'area' || type === 'path') {
    id += '-' + type;
  } else {
    id += xScale.isCategory ? '-' + xVal : '-' + xVal + '-' + yVal;
  }

  var groupScales = geom._getGroupScales();

  each(groupScales, function (groupScale) {
    var field = groupScale.field;

    if (groupScale.type !== 'identity') {
      id += '-' + dataObj[field];
    }
  });
  return id;
} // get geometry's shapes


function getShapes(geoms, chart, coord) {
  var shapes = [];
  each(geoms, function (geom, geomIdx) {
    var geomContainer = geom.get('container');
    var geomShapes = geomContainer.get('children');
    var type = geom.get('type');
    var animateCfg = isNil(geom.get('animateCfg')) ? _getAnimateCfgByShapeType(type, chart) : geom.get('animateCfg');

    if (animateCfg !== false) {
      each(geomShapes, function (shape, index) {
        if (shape.get('className') === type) {
          shape._id = _getShapeId(geom, shape.get('origin')._origin, geomIdx);
          shape.set('coord', coord);
          shape.set('animateCfg', animateCfg);
          shape.set('index', index);
          shapes.push(shape);
        }
      });
    }

    geom.set('shapes', geomShapes);
  });
  return shapes;
}

function cache(shapes) {
  var rst = {};

  for (var i = 0, len = shapes.length; i < len; i++) {
    var shape = shapes[i];
    if (!shape._id || shape.isClip) continue;
    var id = shape._id;
    rst[id] = {
      _id: id,
      type: shape.get('type'),
      // the type of shape
      attrs: mix({}, shape._attrs.attrs),
      // the graphics attributes of shape
      className: shape.get('className'),
      geomType: shape.get('className'),
      index: shape.get('index'),
      coord: shape.get('coord'),
      animateCfg: shape.get('animateCfg')
    };
  }

  return rst;
}

function getAnimate(geomType, coord, animationType, animationName) {
  var result;

  if (isFunction(animationName)) {
    result = animationName;
  } else if (isString(animationName)) {
    result = Animate.Action[animationName];
  } else {
    result = Animate.getAnimation(geomType, coord, animationType);
  }

  return result;
}

function getAnimateCfg(geomType, animationType, animateCfg) {
  if (animateCfg === false || isObject(animateCfg) && animateCfg[animationType] === false) {
    return false;
  }

  var defaultCfg = Animate.getAnimateCfg(geomType, animationType);

  if (animateCfg && animateCfg[animationType]) {
    return deepMix({}, defaultCfg, animateCfg[animationType]);
  }

  return defaultCfg;
}

function addAnimate(cache, shapes, canvas) {
  var animate;
  var animateCfg; // the order of animation: leave -> update -> enter

  var updateShapes = [];
  var newShapes = [];
  each(shapes, function (shape) {
    var result = cache[shape._id];

    if (!result) {
      newShapes.push(shape);
    } else {
      shape.set('cacheShape', result);
      updateShapes.push(shape);
      delete cache[shape._id];
    }
  }); // first do the leave animation

  each(cache, function (deletedShape) {
    var {
      className,
      coord,
      _id,
      attrs,
      index,
      type
    } = deletedShape;
    animateCfg = getAnimateCfg(className, 'leave', deletedShape.animateCfg);
    if (animateCfg === false) return true;
    animate = getAnimate(className, coord, 'leave', animateCfg.animation);

    if (isFunction(animate)) {
      var tempShape = canvas.addShape(type, {
        attrs,
        index,
        canvas,
        className
      });
      tempShape._id = _id;
      animate(tempShape, animateCfg, coord);
    }
  }); // then do the update animation

  each(updateShapes, function (updateShape) {
    var className = updateShape.get('className');
    animateCfg = getAnimateCfg(className, 'update', updateShape.get('animateCfg'));
    if (animateCfg === false) return true;
    var coord = updateShape.get('coord');
    var cacheAttrs = updateShape.get('cacheShape').attrs;
    var endState = diff(cacheAttrs, updateShape._attrs.attrs); // 判断如果属性相同的话就不进行变换

    if (Object.keys(endState).length) {
      animate = getAnimate(className, coord, 'update', animateCfg.animation);

      if (isFunction(animate)) {
        animate(updateShape, animateCfg, coord);
      } else {
        updateShape.attr(cacheAttrs);
        updateShape.animate().to({
          attrs: endState,
          duration: animateCfg.duration,
          easing: animateCfg.easing,
          delay: animateCfg.delay
        }).onEnd(function () {
          updateShape.set('cacheShape', null);
        });
      }
    }
  }); // last, enter animation

  each(newShapes, function (newShape) {
    // 新图形元素的进场元素
    var className = newShape.get('className');
    var coord = newShape.get('coord');
    animateCfg = getAnimateCfg(className, 'enter', newShape.get('animateCfg'));
    if (animateCfg === false) return true;
    animate = getAnimate(className, coord, 'enter', animateCfg.animation);

    if (isFunction(animate)) {
      if (className === 'interval' && coord.isPolar && coord.transposed) {
        var index = newShape.get('index');
        var lastShape = updateShapes[index - 1];
        animate(newShape, animateCfg, lastShape);
      } else {
        animate(newShape, animateCfg, coord);
      }
    }
  });
}

function _getAnimateCfgByShapeType(type, chart) {
  if (!type) {
    return null;
  }

  var animateCfg = chart.get('animate');

  if (type.indexOf('guide-tag') > -1) {
    type = 'guide-tag';
  }

  if (isObject(animateCfg)) {
    return animateCfg[type];
  }

  if (animateCfg === false) {
    return false;
  }

  return null;
}

function afterCanvasInit()
/* chart */
{
  timeline = new Timeline();
  timeline.play();
}

function beforeCanvasDraw(chart) {
  if (chart.get('animate') === false) {
    return;
  }

  var isUpdate = chart.get('isUpdate');
  var canvas = chart.get('canvas');
  var coord = chart.get('coord');
  var geoms = chart.get('geoms');
  var caches = canvas.get('caches') || [];

  if (caches.length === 0) {
    isUpdate = false;
  }

  var cacheShapes = getShapes(geoms, chart, coord);
  var {
    frontPlot,
    backPlot
  } = chart.get('axisController');
  var axisShapes = frontPlot.get('children').concat(backPlot.get('children'));
  var guideShapes = [];

  if (chart.get('guideController')) {
    guideShapes = chart.get('guideController').guideShapes;
  }

  var componentShapes = [];
  axisShapes.concat(guideShapes).forEach(function (s) {
    var className = s.get('className');

    var animateCfg = _getAnimateCfgByShapeType(className, chart);

    s.set('coord', coord);
    s.set('animateCfg', animateCfg);
    componentShapes.push(s);
    cacheShapes.push(s);
  });
  canvas.set('caches', cache(cacheShapes));

  if (isUpdate) {
    addAnimate(caches, cacheShapes, canvas);
  } else {
    // do the appear animation
    var animateCfg;
    var animate;
    each(geoms, function (geom) {
      var type = geom.get('type');
      var geomCfg = isNil(geom.get('animateCfg')) ? _getAnimateCfgByShapeType(type, chart) : geom.get('animateCfg');

      if (geomCfg !== false) {
        animateCfg = getAnimateCfg(type, 'appear', geomCfg);
        animate = getAnimate(type, coord, 'appear', animateCfg.animation);

        if (isFunction(animate)) {
          var shapes = geom.get('shapes');
          each(shapes, function (shape) {
            animate(shape, animateCfg, coord);
          });
        } else if (GROUP_ANIMATION[type]) {
          // do the default animation
          animate = GroupAction[animateCfg.animation] || GROUP_ANIMATION[type](coord);
          var yScale = geom.getYScale();
          var zeroY = coord.convertPoint({
            x: 0,
            y: yScale.scale(geom.getYMinValue())
          });
          var container = geom.get('container');
          animate && animate(container, animateCfg, coord, zeroY);
        }
      }
    }); // do the animation of components

    each(componentShapes, function (shape) {
      var animateCfg = shape.get('animateCfg');
      var className = shape.get('className');

      if (animateCfg && animateCfg.appear) {
        // if user configure
        var defaultCfg = Animate.getAnimateCfg(className, 'appear');
        var appearCfg = deepMix({}, defaultCfg, animateCfg.appear);

        var _animate = getAnimate(className, coord, 'appear', appearCfg.animation);

        if (isFunction(_animate)) {
          _animate(shape, appearCfg, coord);
        }
      }
    });
  }
}

function afterCanvasDestroyed()
/* chart */
{
  timeline.stop();
}

export { afterCanvasInit, beforeCanvasDraw, afterCanvasDestroyed };
export default {
  afterCanvasInit,
  beforeCanvasDraw,
  afterCanvasDestroyed
};