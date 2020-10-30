import { deepMix, each, mix, isFunction, upperFirst } from '../util/common';
import Guide from '../component/guide/base';
import Global from '../global'; // register the default configuration for Guide

Global.guide = deepMix({
  line: {
    style: {
      stroke: '#a3a3a3',
      lineWidth: 1
    },
    top: true
  },
  text: {
    style: {
      fill: '#787878',
      textAlign: 'center',
      textBaseline: 'middle'
    },
    offsetX: 0,
    offsetY: 0,
    top: true
  },
  rect: {
    style: {
      fill: '#fafafa'
    },
    top: false
  },
  arc: {
    style: {
      stroke: '#a3a3a3'
    },
    top: true
  },
  html: {
    offsetX: 0,
    offsetY: 0,
    alignX: 'center',
    alignY: 'middle'
  },
  tag: {
    top: true,
    offsetX: 0,
    offsetY: 0,
    side: 4,
    background: {
      padding: 5,
      radius: 2,
      fill: '#1890FF'
    },
    textStyle: {
      fontSize: 12,
      fill: '#fff',
      textAlign: 'center',
      textBaseline: 'middle'
    }
  },
  point: {
    top: true,
    offsetX: 0,
    offsetY: 0,
    style: {
      fill: '#fff',
      r: 3,
      lineWidth: 2,
      stroke: '#1890ff'
    }
  }
}, Global.guide || {});

class GuideController {
  constructor(cfg) {
    this.guides = [];
    this.xScale = null;
    this.yScales = null;
    this.guideShapes = [];
    mix(this, cfg);
  }

  _toString(position) {
    if (isFunction(position)) {
      position = position(this.xScale, this.yScales);
    }

    position = position.toString();
    return position;
  }

  _getId(shape, guide) {
    var id = guide.id;

    if (!id) {
      var type = guide.type;

      if (type === 'arc' || type === 'line' || type === 'rect') {
        id = this._toString(guide.start) + '-' + this._toString(guide.end);
      } else {
        id = this._toString(guide.position);
      }
    }

    return id;
  }

  paint(coord) {
    var self = this;
    var {
      chart,
      guides,
      xScale,
      yScales
    } = self;
    var guideShapes = [];
    each(guides, function (guide, idx) {
      guide.xScale = xScale;
      guide.yScales = yScales;
      var container;

      if (guide.type === 'regionFilter') {
        // TODO: RegionFilter support animation
        guide.chart = chart;
      } else {
        container = guide.top ? self.frontPlot : self.backPlot;
      }

      guide.coord = coord;
      guide.container = container;
      guide.canvas = chart.get('canvas');
      var shape = guide.render(coord, container);

      if (shape) {
        var id = self._getId(shape, guide);

        [].concat(shape).forEach(function (s) {
          s._id = s.get('className') + '-' + id;
          s.set('index', idx);
          guideShapes.push(s);
        });
      }
    });
    self.guideShapes = guideShapes;
  }

  clear() {
    this.reset();
    this.guides = [];
    return this;
  }

  reset() {
    var guides = this.guides;
    each(guides, function (guide) {
      guide.remove();
    });
  }

  _createGuide(type, cfg) {
    var ClassName = upperFirst(type);
    var guide = new Guide[ClassName](deepMix({}, Global.guide[type], cfg));
    this.guides.push(guide);
    return guide;
  }

  line() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this._createGuide('line', cfg);
  }

  text() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this._createGuide('text', cfg);
  }

  arc() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this._createGuide('arc', cfg);
  }

  html() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this._createGuide('html', cfg);
  }

  rect() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this._createGuide('rect', cfg);
  }

  tag() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this._createGuide('tag', cfg);
  }

  point() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this._createGuide('point', cfg);
  }

  regionFilter() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this._createGuide('regionFilter', cfg);
  }

}

function init(chart) {
  var guideController = new GuideController({
    frontPlot: chart.get('frontPlot').addGroup({
      zIndex: 20,
      className: 'guideContainer'
    }),
    backPlot: chart.get('backPlot').addGroup({
      className: 'guideContainer'
    })
  });
  chart.set('guideController', guideController);
  /**
   * 为图表添加 guide
   * @return {GuideController} 返回 guide 控制器
   */

  chart.guide = function () {
    return guideController;
  };
}

function afterGeomDraw(chart) {
  var guideController = chart.get('guideController');

  if (!guideController.guides.length) {
    return;
  }

  var xScale = chart.getXScale();
  var yScales = chart.getYScales();
  var coord = chart.get('coord');
  guideController.xScale = xScale;
  guideController.yScales = yScales;
  guideController.chart = chart; // for regionFilter

  guideController.paint(coord);
}

function clear(chart) {
  chart.get('guideController').clear();
}

function repaint(chart) {
  chart.get('guideController').reset();
}

export { init, afterGeomDraw, clear, repaint };
export default {
  init,
  afterGeomDraw,
  clear,
  repaint
};