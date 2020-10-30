"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _emit = _interopRequireDefault(require("./graphic/event/emit"));

var _common = require("./util/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Base = /*#__PURE__*/function (_Emit) {
  _inheritsLoose(Base, _Emit);

  var _proto = Base.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    return {};
  };

  function Base(cfg) {
    var _this;

    _this = _Emit.call(this) || this;
    var attrs = {};

    var defaultCfg = _this.getDefaultCfg();

    _this._attrs = attrs;
    (0, _common.mix)(attrs, defaultCfg, cfg);
    return _this;
  }

  _proto.get = function get(name) {
    return this._attrs[name];
  };

  _proto.set = function set(name, value) {
    this._attrs[name] = value;
  };

  _proto.destroy = function destroy() {
    this._attrs = {};
    this.destroyed = true;
  };

  return Base;
}(_emit["default"]);

var _default = Base;
exports["default"] = _default;