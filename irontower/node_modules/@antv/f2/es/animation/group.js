/**
 * Group animation
 * @author sima.zhang1990@gmail.com
 */
import { mix, deepMix, each, isFunction } from '../util/common';
import Shape from '../graphic/shape';
import Timeline from '../graphic/animate/timeline';
import Animator from '../graphic/animate/animator';
import Animate from './animate';
import * as Action from './group-action';
var timeline;

Shape.prototype.animate = function () {
  var attrs = mix({}, this.get('attrs'));
  return new Animator(this, attrs, timeline);
};

Animate.Action = Action;
Animate.defaultCfg = {
  line(coord) {
    if (coord.isPolar) {
      return Action.groupScaleInXY;
    }

    return Action.groupWaveIn;
  },

  area(coord) {
    if (coord.isPolar) {
      return Action.groupScaleInXY;
    }

    return Action.groupWaveIn;
  },

  path(coord) {
    if (coord.isPolar) {
      return Action.groupScaleInXY;
    }

    return Action.groupWaveIn;
  },

  point() {
    return Action.shapesScaleInXY;
  },

  interval(coord) {
    var result;

    if (coord.isPolar) {
      result = Action.groupScaleInXY;

      if (coord.transposed) {
        result = Action.groupWaveIn;
      }
    } else {
      result = coord.transposed ? Action.groupScaleInX : Action.groupScaleInY;
    }

    return result;
  },

  schema() {
    return Action.groupWaveIn;
  }

};

function getAnimate(geomType, coord, animationName) {
  var result;

  if (animationName) {
    result = Animate.Action[animationName];
  } else {
    result = Animate.getAnimation(geomType, coord, 'appear');
  }

  return result;
}

function getAnimateCfg(geomType, animateCfg) {
  var defaultCfg = Animate.getAnimateCfg(geomType, 'appear');

  if (animateCfg && animateCfg.appear) {
    return deepMix({}, defaultCfg, animateCfg.appear);
  }

  return defaultCfg;
}

export default {
  afterCanvasInit()
  /* chart */
  {
    timeline = new Timeline();
    timeline.play();
  },

  beforeCanvasDraw(chart) {
    if (chart.get('animate') === false) {
      return;
    }

    var geoms = chart.get('geoms');
    var coord = chart.get('coord');
    var animateCfg;
    var animate;
    each(geoms, function (geom) {
      var type = geom.get('type');
      var container = geom.get('container');

      if (geom.get('animateCfg') !== false) {
        animateCfg = getAnimateCfg(type, geom.get('animateCfg'));
        animate = getAnimate(type, coord, animateCfg.animation);

        if (isFunction(animate)) {
          animate(container, animateCfg);
        } else if (Animate.defaultCfg[type]) {
          animate = Animate.defaultCfg[type](coord);
          var yScale = geom.getYScale();
          var zeroY = coord.convertPoint({
            x: 0,
            y: yScale.scale(geom.getYMinValue())
          });
          animate && animate(container, animateCfg, coord, zeroY);
        }
      }
    });
  },

  afterCanvasDestroyed()
  /* chart */
  {
    timeline.stop();
  }

};