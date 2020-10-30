"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

var _common = require("../../util/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Pinch = /*#__PURE__*/function (_Base) {
  _inheritsLoose(Pinch, _Base);

  var _proto = Pinch.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    return {
      type: 'pinch',
      startEvent: 'pinchstart',
      processEvent: 'pinch',
      endEvent: 'pinchend'
    };
  };

  function Pinch(cfg, chart) {
    var _this;

    _this = _Base.call(this, cfg, chart) || this;

    var _assertThisInitialize = _assertThisInitialized(_this),
        context = _assertThisInitialize.context;

    (0, _common.mix)(context, cfg);
    return _this;
  }

  _proto.start = function start() {
    var context = this.context;
    context.start();
  };

  _proto.process = function process(e) {
    e.preventDefault && e.preventDefault();
    var zoom = e.zoom,
        center = e.center;
    var context = this.context;
    var chart = context.chart;
    var coord = chart.get('coord');
    var start = coord.start,
        end = coord.end;
    var coordWidth = end.x - start.x;
    var leftLen = Math.abs(center.x - start.x);
    var rightLen = Math.abs(end.x - center.x); // 计算左右缩放的比例

    var leftScale = leftLen / coordWidth;
    var rightScale = rightLen / coordWidth;
    context.doZoom(leftScale, rightScale, zoom);
  };

  _proto.end = function end() {
    // 缩放完成后再更新ticks
    var context = this.context;
    context.updateTicks();
  };

  return Pinch;
}(_base["default"]);

var _default = Pinch;
exports["default"] = _default;