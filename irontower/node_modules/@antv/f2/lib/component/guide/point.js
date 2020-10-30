"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../../util/common");

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Point = /*#__PURE__*/function (_GuideBase) {
  _inheritsLoose(Point, _GuideBase);

  function Point() {
    return _GuideBase.apply(this, arguments) || this;
  }

  var _proto = Point.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    this.type = 'point';
    this.position = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.style = {
      fill: '#1890FF',
      r: 3,
      lineWidth: 1,
      stroke: '#fff'
    };
  };

  _proto.render = function render(coord, container) {
    var position = this.parsePoint(coord, this.position);
    if (!position) return null;
    var shape = container.addShape('Circle', {
      className: 'guide-point',
      attrs: (0, _common.mix)({
        x: position.x + this.offsetX,
        y: position.y + this.offsetY
      }, this.style)
    });
    this.element = shape;
    return shape;
  };

  return Point;
}(_base["default"]);

_base["default"].Point = Point;
var _default = Point;
exports["default"] = _default;