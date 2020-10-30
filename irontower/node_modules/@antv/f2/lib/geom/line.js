"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _path = _interopRequireDefault(require("./path"));

var _base = _interopRequireDefault(require("./base"));

require("./shape/line");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Line = /*#__PURE__*/function (_Path) {
  _inheritsLoose(Line, _Path);

  function Line() {
    return _Path.apply(this, arguments) || this;
  }

  var _proto = Line.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Path.prototype.getDefaultCfg.call(this);

    cfg.type = 'line';
    cfg.sortable = true;
    return cfg;
  };

  return Line;
}(_path["default"]);

_base["default"].Line = Line;
var _default = Line;
exports["default"] = _default;