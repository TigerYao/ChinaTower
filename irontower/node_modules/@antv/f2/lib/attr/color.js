"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _util = require("@antv/util");

var _base = _interopRequireDefault(require("./base"));

var _colorUtil = require("./color-util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Color = /*#__PURE__*/function (_Base) {
  _inheritsLoose(Color, _Base);

  function Color(cfg) {
    var _this;

    _this = _Base.call(this, cfg) || this;
    _this.names = ['color'];
    _this.type = 'color';
    _this.gradient = null;

    if ((0, _util.isString)(_this.values)) {
      _this.linear = true;
    }

    return _this;
  }
  /**
   * @override
   */


  var _proto = Color.prototype;

  _proto.getLinearValue = function getLinearValue(percent) {
    var gradient = this.gradient;

    if (!gradient) {
      var values = this.values;
      gradient = (0, _colorUtil.gradient)(values);
      this.gradient = gradient;
    }

    return gradient(percent);
  };

  return Color;
}(_base["default"]);

var _default = Color;
exports["default"] = _default;