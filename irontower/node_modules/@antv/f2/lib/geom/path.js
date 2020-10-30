"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

var _util = require("./shape/util");

var _common = require("../util/common");

require("./shape/line");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Path = /*#__PURE__*/function (_Geom) {
  _inheritsLoose(Path, _Geom);

  function Path() {
    return _Geom.apply(this, arguments) || this;
  }

  var _proto = Path.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Geom.prototype.getDefaultCfg.call(this);

    cfg.type = 'path';
    cfg.shapeType = 'line';
    return cfg;
  };

  _proto.getDrawCfg = function getDrawCfg(obj) {
    var cfg = _Geom.prototype.getDrawCfg.call(this, obj);

    cfg.isStack = this.hasAdjust('stack');
    return cfg;
  };

  _proto.draw = function draw(data, shapeFactory) {
    var self = this;
    var container = self.get('container');
    var yScale = self.getYScale();
    var connectNulls = self.get('connectNulls');
    var splitArrayObj = (0, _util.splitArray)(data, yScale.field, connectNulls);
    var cfg = this.getDrawCfg(data[0]);
    cfg.origin = data;
    (0, _common.each)(splitArrayObj, function (subData, splitedIndex) {
      cfg.splitedIndex = splitedIndex;
      cfg.points = subData;
      self.drawShape(cfg.shape, data[0], cfg, container, shapeFactory);
    });
  };

  return Path;
}(_base["default"]);

_base["default"].Path = Path;
var _default = Path;
exports["default"] = _default;