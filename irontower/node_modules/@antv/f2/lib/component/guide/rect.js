"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../../util/common");

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Rect = /*#__PURE__*/function (_GuideBase) {
  _inheritsLoose(Rect, _GuideBase);

  function Rect() {
    return _GuideBase.apply(this, arguments) || this;
  }

  var _proto = Rect.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    this.type = 'rect';
    this.start = [];
    this.end = [];
    this.style = {
      fill: '#CCD7EB',
      opacity: 0.4
    };
  };

  _proto.render = function render(coord, container) {
    var start = this.parsePoint(coord, this.start);
    var end = this.parsePoint(coord, this.end);

    if (!start || !end) {
      return;
    }

    var shape = container.addShape('rect', {
      className: 'guide-rect',
      attrs: (0, _common.mix)({
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(start.y - end.y)
      }, this.style)
    });
    this.element = shape;
    return shape;
  };

  return Rect;
}(_base["default"]);

_base["default"].Rect = Rect;
var _default = Rect;
exports["default"] = _default;