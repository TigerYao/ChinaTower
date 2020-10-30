"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Opacity = /*#__PURE__*/function (_Base) {
  _inheritsLoose(Opacity, _Base);

  function Opacity(cfg) {
    var _this;

    _this = _Base.call(this, cfg) || this;
    _this.names = ['opacity'];
    _this.type = 'opacity';
    _this.gradient = null;
    return _this;
  }

  return Opacity;
}(_base["default"]);

var _default = Opacity;
exports["default"] = _default;