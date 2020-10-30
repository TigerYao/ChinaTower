"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Pan = /*#__PURE__*/function (_Base) {
  _inheritsLoose(Pan, _Base);

  function Pan() {
    return _Base.apply(this, arguments) || this;
  }

  var _proto = Pan.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    return {
      type: 'pan',
      startEvent: 'panstart',
      processEvent: 'pan',
      endEvent: 'panend'
    };
  };

  _proto.start = function start() {
    var context = this.context;
    context.start();
  };

  _proto.process = function process(e) {
    var direction = e.direction,
        deltaX = e.deltaX;

    if (direction === 'up' || direction === 'down') {
      return;
    }

    e.preventDefault && e.preventDefault();
    var context = this.context;
    var chart = context.chart;
    var coord = chart.get('coord');
    var start = coord.start,
        end = coord.end;
    var coordWidth = end.x - start.x;
    var ratio = deltaX / coordWidth;
    context.doMove(ratio);
  };

  return Pan;
}(_base["default"]);

var _default = Pan;
exports["default"] = _default;