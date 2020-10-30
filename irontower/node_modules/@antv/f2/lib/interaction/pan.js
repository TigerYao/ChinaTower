"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../util/common");

var _base = _interopRequireDefault(require("./base"));

var _chart = _interopRequireDefault(require("../chart/chart"));

var _move = _interopRequireDefault(require("./mixin/move"));

var _updateScale = _interopRequireDefault(require("./mixin/update-scale"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Pan = /*#__PURE__*/function (_Interaction) {
  _inheritsLoose(Pan, _Interaction);

  var _proto = Pan.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    var defaultCfg = _Interaction.prototype.getDefaultCfg.call(this);

    defaultCfg = (0, _common.mix)({}, defaultCfg, {
      startEvent: 'panstart',
      processEvent: 'panmove',
      endEvent: 'panend',
      resetEvent: 'touchend',
      mode: 'x',
      panThreshold: 10,
      // Minimal pan distance required before recognizing
      pressThreshold: 9,
      // Minimal movement that is allowed while pressing
      pressTime: 251,
      // Minimal press time in ms
      currentDeltaX: null,
      currentDeltaY: null,
      limitRange: {},
      _timestamp: 0,
      lastPoint: null,
      _panCumulativeDelta: 0,
      speed: 5
    });

    if (_common.isWx || _common.isMy) {
      // 小程序
      defaultCfg.startEvent = 'touchstart';
      defaultCfg.processEvent = 'touchmove';
      defaultCfg.endEvent = 'touchend';
    }

    return defaultCfg;
  };

  function Pan(cfg, chart) {
    var _this;

    _this = _Interaction.call(this, cfg, chart) || this;

    var self = _assertThisInitialized(_this);

    var hammer = self.hammer,
        panThreshold = self.panThreshold;
    chart.set('limitInPlot', true);

    if (hammer) {
      hammer.get('pan').set({
        threshold: panThreshold
      }); // 为了兼容hammer的pan 和 tooltips里的press, 后面去hammerjs的时候需要去掉

      chart.get('canvas').on('pan', function () {});
    } // chart.registerPlugins([ FilterPlugin, {
    //   changeData() {
    //     self.limitRange = {};
    //   },
    //   clear() {
    //     self.limitRange = {};
    //   }
    // }]);


    (0, _common.mix)(_assertThisInitialized(_this), _updateScale["default"], _move["default"]);
    return _this;
  }

  _proto.start = function start(e) {
    if (this.pressed) return;
    this.currentDeltaX = 0;
    this.currentDeltaY = 0;

    if (e.type === 'touchstart' || e.type === 'touchStart') {
      this.lastPoint = e.touches[0];
    }

    this._handleMove(e);
  };

  _proto.process = function process(e) {
    if (this.pressed) return;

    this._handleMove(e);
  };

  _proto.end = function end() {
    if (this.pressed) return;
    this.currentDeltaX = null;
    this.currentDeltaY = null;
    this.lastPoint = null;
    this._panCumulativeDelta = 0;
  };

  return Pan;
}(_base["default"]);

_chart["default"].registerInteraction('pan', Pan);

var _default = Pan;
exports["default"] = _default;