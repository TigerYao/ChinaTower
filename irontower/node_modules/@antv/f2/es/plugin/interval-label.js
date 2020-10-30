import { mix } from '../util/common';
var DEFAULT_CFG = {
  label: null,
  offsetX: 0,
  offsetY: 0
};
var DEFAULT_LABEL_CFG = {
  textBaseline: 'middle',
  fill: '#808080'
}; // 2个点的中心点

function getMiddlePoint(a, b) {
  var x = (a.x - b.x) / 2 + b.x;
  var y = (a.y - b.y) / 2 + b.y;
  return {
    x,
    y
  };
} // function getLabelPoint(points, nextPoints) {
//   let start;
//   if (nextPoints && nextPoints.length) {
//     start = getMiddlePoint(points[1], nextPoints[1]);
//   } else {
//     const nextPoint = getMiddlePoint(points[2], points[3]);
//     start = getMiddlePoint(points[1], nextPoint);
//   }
//   const end = getMiddlePoint(points[1], points[2]);
//   return { start, end };
// }


class Controller {
  constructor(_ref) {
    var {
      chart,
      container
    } = _ref;
    this.cfg = null;
    this.chart = chart;
    this.container = container;
  }

  draw() {
    var {
      chart,
      container,
      cfg
    } = this;
    if (!cfg) return;
    var labelCfg = mix({}, DEFAULT_CFG, cfg);
    var geom = chart.get('geoms')[0];
    var shapes = geom.get('container').get('children');
    shapes.forEach(function (shape) {
      var origin = shape.get('origin');
      var attrs = shape.get('attrs');
      var {
        _origin,
        color
      } = origin;
      var {
        points
      } = attrs;

      if (labelCfg.label) {
        var labelAttrs = labelCfg.label(_origin, color);
        var point = getMiddlePoint(points[1], points[2]);
        container.addShape('Text', {
          attrs: mix({
            x: point.x + labelCfg.offsetX,
            y: point.y + labelCfg.offsetY
          }, DEFAULT_LABEL_CFG, labelAttrs)
        });
      }

      if (labelCfg.guide) {
        var _labelAttrs = labelCfg.guide(_origin, color);

        var _point = getMiddlePoint(getMiddlePoint(points[0], points[1]), getMiddlePoint(points[2], points[3] || points[2]));

        container.addShape('Text', {
          attrs: mix({
            x: _point.x,
            y: _point.y,
            textBaseline: 'middle',
            textAlign: 'center'
          }, DEFAULT_LABEL_CFG, _labelAttrs)
        });
      }
    });
  }

  clear() {
    var {
      container
    } = this;
    container.clear();
  }

}

function init(chart) {
  var frontPlot = chart.get('frontPlot');
  var labelGroup = frontPlot.addGroup({
    className: 'label',
    zIndex: 0
  });
  var labelController = new Controller({
    chart,
    container: labelGroup
  });
  chart.set('intervalLabelController', labelController);

  chart.intervalLabel = function (cfg) {
    labelController.cfg = cfg;
  };
}

function afterGeomDraw(chart) {
  var labelController = chart.get('intervalLabelController');
  labelController.draw();
}

function clearInner(chart) {
  var labelController = chart.get('intervalLabelController');
  labelController.clear();
}

export { init, afterGeomDraw, clearInner };
export default {
  init,
  afterGeomDraw,
  clearInner
};