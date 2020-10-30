import Hammer from 'hammerjs';
import { deepMix, addEventListener, removeEventListener } from '../util/common';
var defaultOptions = {
  useCalculate: true,
  useOffset: false
};

class GestureController {
  constructor(_ref) {
    var {
      dom,
      gesture,
      options,
      chart,
      hammerOptions
    } = _ref;
    this.Hammer = Hammer;
    this.hammer = new Hammer(dom, hammerOptions);
    this.dom = dom;
    this.gesture = gesture;
    this.options = deepMix({}, defaultOptions, options);
    this.hammerOptions = hammerOptions;
    this.chart = chart;
    this._unbindEvent = {};

    if (!options) {
      this.hammerOptionsHack(gesture, this.hammer);
    }
  }

  hammerOptionsHack(gesture, hammer) {
    for (var key in gesture) {
      if (key.indexOf('swipe') !== -1 && hammer.get('swipe')) {
        hammer.get('swipe').set({
          enable: true
        });
      }

      if (key.indexOf('pinch') !== -1 && hammer.get('pinch')) {
        hammer.get('pinch').set({
          enable: true
        });
      }
    }
  }

  bindEvents() {
    var _this = this;

    var {
      gesture,
      hammer,
      dom
    } = this;
    var {
      useCalculate
    } = this.options;

    if (!hammer) {
      return;
    }

    var _loop = function _loop(key) {
      if (['touchstart', 'touchmove', 'touchend'].indexOf(key) !== -1) {
        var bindEvent = function bindEvent(event) {
          var records = useCalculate ? _this.getEventPositionRecords(event, true) : null;
          gesture[key](records, event);
        };

        addEventListener(dom, key, bindEvent);
        _this._unbindEvent[key] = bindEvent;
      } else {
        hammer.on(key, function (event) {
          var records = useCalculate ? _this.getEventPositionRecords(event, false) : null;
          gesture[key](records, event);
        });
      }
    };

    for (var key in gesture) {
      _loop(key);
    }
  }

  getEventPositionRecords(event, _isOrigin) {
    var {
      useOffset
    } = this.options;
    var canvasDom = this.chart.get('canvas').get('el');
    var x;
    var y;

    if (_isOrigin) {
      var positionSource = event.targetTouches.length > 0 ? event.targetTouches[0] : event.changedTouches[0];

      if (useOffset) {
        x = positionSource.clientX - canvasDom.offsetLeft;
        y = positionSource.clientY - canvasDom.offsetTop;
      } else {
        x = positionSource.clientX;
        y = positionSource.clientY;
      }
    } else {
      if (useOffset) {
        x = event.center.x - canvasDom.offsetLeft;
        y = event.center.y - canvasDom.offsetTop;
      } else {
        x = event.center.x;
        y = event.center.y;
      }
    }

    return this.chart.getSnapRecords({
      x,
      y
    });
  }

  destroy() {
    this.hammer.destroy();

    for (var key in this._unbindEvent) {
      var event = this._unbindEvent[key];
      removeEventListener(this.dom, key, event);
    }
  }

}

function init(chart) {
  chart.pluginGesture = function (_ref2) {
    var {
      gesture,
      options,
      hammerOptions
    } = _ref2;
    var canvasDom = chart.get('canvas').get('el');
    var gestureController = new GestureController({
      dom: canvasDom,
      gesture,
      options,
      hammerOptions,
      chart
    });
    gestureController.bindEvents();
    chart.set('gestureController', gestureController);
    return gestureController;
  };
}

function clear(chart) {
  var gestureController = chart.get('gestureController');
  gestureController && gestureController.destroy();
}

export { init, clear };