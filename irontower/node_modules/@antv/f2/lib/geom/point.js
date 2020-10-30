"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../util/common");

var _base = _interopRequireDefault(require("./base"));

require("./shape/point");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Point = /*#__PURE__*/function (_Geom) {
  _inheritsLoose(Point, _Geom);

  function Point() {
    return _Geom.apply(this, arguments) || this;
  }

  var _proto = Point.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Geom.prototype.getDefaultCfg.call(this);

    cfg.type = 'point';
    cfg.shapeType = 'point';
    cfg.generatePoints = false;
    return cfg;
  };

  _proto.draw = function draw(data, shapeFactory) {
    var self = this;
    var container = self.get('container');
    (0, _common.each)(data, function (obj) {
      var shape = obj.shape;
      var cfg = self.getDrawCfg(obj);

      if ((0, _common.isArray)(obj.y)) {
        var hasStack = self.hasAdjust('stack');
        (0, _common.each)(obj.y, function (y, idx) {
          cfg.y = y;

          if (!hasStack || idx !== 0) {
            self.drawShape(shape, obj, cfg, container, shapeFactory);
          }
        });
      } else if (!(0, _common.isNil)(obj.y)) {
        self.drawShape(shape, obj, cfg, container, shapeFactory);
      }
    });
  };

  return Point;
}(_base["default"]);

_base["default"].Point = Point;
var _default = Point;
exports["default"] = _default;