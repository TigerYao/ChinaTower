"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../../util/common");

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Line = /*#__PURE__*/function (_GuideBase) {
  _inheritsLoose(Line, _GuideBase);

  function Line() {
    return _GuideBase.apply(this, arguments) || this;
  }

  var _proto = Line.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    this.type = 'line';
    this.start = [];
    this.end = [];
    this.style = {
      stroke: '#000',
      lineWidth: 1
    };
  };

  _proto.render = function render(coord, container) {
    var points = [];
    points[0] = this.parsePoint(coord, this.start);
    points[1] = this.parsePoint(coord, this.end);

    if (!points[0] || !points[1]) {
      return;
    }

    var shape = container.addShape('Line', {
      className: 'guide-line',
      attrs: (0, _common.mix)({
        x1: points[0].x,
        y1: points[0].y,
        x2: points[1].x,
        y2: points[1].y
      }, this.style)
    });
    this.element = shape;
    return shape;
  };

  return Line;
}(_base["default"]);

_base["default"].Line = Line;
var _default = Line;
exports["default"] = _default;