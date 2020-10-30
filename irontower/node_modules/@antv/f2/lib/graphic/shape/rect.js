"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../../util/common");

var _shape = _interopRequireDefault(require("../shape"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

// 为了处理radius 大于 width 或 height 的场景
function parseRadius(radius, width, height) {
  radius = (0, _common.parsePadding)(radius); // 都为0

  if (!radius[0] && !radius[1] && !radius[2] && !radius[3]) {
    return radius;
  }

  var minWidth = Math.max(radius[0] + radius[1], radius[2] + radius[3]);
  var minHeight = Math.max(radius[0] + radius[3], radius[1] + radius[2]);
  var scale = Math.min(width / minWidth, height / minHeight);

  if (scale < 1) {
    return radius.map(function (r) {
      return r * scale;
    });
  }

  return radius;
}

var Rect = /*#__PURE__*/function (_Shape) {
  _inheritsLoose(Rect, _Shape);

  function Rect() {
    return _Shape.apply(this, arguments) || this;
  }

  var _proto = Rect.prototype;

  _proto._initProperties = function _initProperties() {
    _Shape.prototype._initProperties.call(this);

    this._attrs.canFill = true;
    this._attrs.canStroke = true;
    this._attrs.type = 'rect';
  };

  _proto.getDefaultAttrs = function getDefaultAttrs() {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      radius: 0,
      lineWidth: 0
    };
  };

  _proto.createPath = function createPath(context) {
    var self = this;
    var attrs = self.get('attrs');
    var x = attrs.x,
        y = attrs.y,
        width = attrs.width,
        height = attrs.height,
        radius = attrs.radius;
    context.beginPath();

    if (!radius || !(width * height)) {
      context.rect(x, y, width, height);
    } else {
      radius = parseRadius(radius, width, height);
      context.moveTo(x + radius[0], y);
      context.lineTo(x + width - radius[1], y);
      context.arc(x + width - radius[1], y + radius[1], radius[1], -Math.PI / 2, 0, false);
      context.lineTo(x + width, y + height - radius[2]);
      context.arc(x + width - radius[2], y + height - radius[2], radius[2], 0, Math.PI / 2, false);
      context.lineTo(x + radius[3], y + height);
      context.arc(x + radius[3], y + height - radius[3], radius[3], Math.PI / 2, Math.PI, false);
      context.lineTo(x, y + radius[0]);
      context.arc(x + radius[0], y + radius[0], radius[0], Math.PI, Math.PI * 3 / 2, false);
      context.closePath();
    }
  };

  _proto.calculateBox = function calculateBox() {
    var attrs = this.get('attrs');
    var x = attrs.x,
        y = attrs.y,
        width = attrs.width,
        height = attrs.height;
    return {
      minX: x,
      minY: y,
      maxX: x + width,
      maxY: y + height
    };
  };

  return Rect;
}(_shape["default"]);

_shape["default"].Rect = Rect;
var _default = Rect;
exports["default"] = _default;