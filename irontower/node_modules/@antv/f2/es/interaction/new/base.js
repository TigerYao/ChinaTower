function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { mix } from '../../util/common';
import Context from './context';

class Base {
  // 交互的上下文
  getDefaultCfg() {
    return {};
  }

  getInteractionContext(chart) {
    var interactionContext = chart.get('interactionContext');

    if (interactionContext) {
      return interactionContext;
    }

    interactionContext = new Context(chart);
    chart.set('interactionContext', interactionContext);
    return interactionContext;
  }

  constructor(cfg, chart) {
    var _this = this;

    _defineProperty(this, "type", '');

    _defineProperty(this, "startEvent", 'touchstart');

    _defineProperty(this, "processEvent", 'touchmove');

    _defineProperty(this, "endEvent", 'touchend');

    _defineProperty(this, "resetEvent", null);

    _defineProperty(this, "context", null);

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

    mix(this, this.getDefaultCfg(), cfg);
    this.context = this.getInteractionContext(chart);
    this.chart = chart; // 只处理range, 暂时先这么处理后面再看情况调整

    var {
      range
    } = this;

    if (range) {
      this.context.range = range;
    }

    this._bindEvents(chart);
  }

  _bindEvents(chart) {
    var {
      startEvent,
      processEvent,
      endEvent,
      resetEvent
    } = this;
    var canvas = chart.get('canvas'); // 统一绑定事件

    canvas.on(startEvent, this._start);
    canvas.on(processEvent, this._process);
    canvas.on(endEvent, this._end);
    canvas.on(resetEvent, this._reset);
  }

  _clearEvents() {
    var {
      chart,
      startEvent,
      processEvent,
      endEvent,
      resetEvent
    } = this;
    var canvas = chart.get('canvas'); // 统一绑定事件

    canvas.off(startEvent, this._start);
    canvas.off(processEvent, this._process);
    canvas.off(endEvent, this._end);
    canvas.off(resetEvent, this._start);
  }

  // override
  start() {} // override


  process() {} // override


  end() {} // override


  reset() {}

  destroy() {
    this.context.destroy();

    this._clearEvents();
  }

}

export default Base;