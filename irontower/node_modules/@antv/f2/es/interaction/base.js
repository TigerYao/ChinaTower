function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * The parent class of interaction
 * @author sima.zhang1990@gmail.com
 */
import './register';
import { deepMix, isWx, isMy, addEventListener, removeEventListener } from '../util/common';
import HammerUtil from 'hammerjs';
var Hammer;

if (!isWx && !isMy) {
  Hammer = HammerUtil;
}

var TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend'];

class Interaction {
  getDefaultCfg() {
    return {
      startEvent: TOUCH_EVENTS[0],
      processEvent: TOUCH_EVENTS[1],
      endEvent: TOUCH_EVENTS[2],
      resetEvent: null
    };
  }

  // override
  start() {} // override


  process() {} // override


  end() {} // override


  reset() {}

  constructor(cfg, chart) {
    var _this = this;

    _defineProperty(this, "_start", function (ev) {
      _this.preStart && _this.preStart(ev);

      _this.start(ev);

      _this.onStart && _this.onStart(ev);
    });

    _defineProperty(this, "_process", function (ev) {
      _this.preProcess && _this.preProcess(ev);

      _this.process(ev);

      _this.onProcess && _this.onProcess(ev);
    });

    _defineProperty(this, "_end", function (ev) {
      _this.preEnd && _this.preEnd(ev);

      _this.end(ev);

      _this.onEnd && _this.onEnd(ev);
    });

    _defineProperty(this, "_reset", function (ev) {
      _this.preReset && _this.preReset(ev);

      _this.reset(ev);

      _this.onReset && _this.onReset(ev);
    });

    var defaultCfg = this.getDefaultCfg();
    deepMix(this, defaultCfg, cfg);
    this.chart = chart;
    this.canvas = chart.get('canvas');
    this.el = chart.get('canvas').get('el');

    this._bindEvents();
  }

  _bindEvents() {
    this._clearEvents(); // clear events


    var {
      startEvent,
      processEvent,
      endEvent,
      resetEvent,
      el
    } = this;

    if (Hammer) {
      this.hammer = new Hammer(el);
    }

    this._bindEvent(startEvent, this._start);

    this._bindEvent(processEvent, this._process);

    this._bindEvent(endEvent, this._end);

    this._bindEvent(resetEvent, this._reset);
  }

  _clearEvents() {
    var {
      startEvent,
      processEvent,
      endEvent,
      resetEvent
    } = this;

    if (this.hammer) {
      this.hammer.destroy();
      this.hammer = null;
    }

    this._clearTouchEvent(startEvent, this._start);

    this._clearTouchEvent(processEvent, this._process);

    this._clearTouchEvent(endEvent, this._end);

    this._clearTouchEvent(resetEvent, this._reset);
  }

  _bindEvent(eventName, method) {
    var el = this.el;

    if (eventName) {
      if (TOUCH_EVENTS.indexOf(eventName) !== -1) {
        addEventListener(el, eventName, method);
      } else if (this.hammer) {
        this.hammer.on(eventName, method);
      }
    }
  }

  _clearTouchEvent(eventName, method) {
    var el = this.el;

    if (eventName && TOUCH_EVENTS.indexOf(eventName) !== -1) {
      removeEventListener(el, eventName, method);
    }
  }

  destroy() {
    this._clearEvents();
  }

}

export default Interaction;