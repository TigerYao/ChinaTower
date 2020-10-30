"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

var _util = require("./shape/util");

var _common = require("../util/common");

require("./shape/area");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Area = /*#__PURE__*/function (_Geom) {
  _inheritsLoose(Area, _Geom);

  function Area() {
    return _Geom.apply(this, arguments) || this;
  }

  var _proto = Area.prototype;

  /**
   * get the default configuration
   * @protected
   * @return {Object} return the result
   */
  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Geom.prototype.getDefaultCfg.call(this);

    cfg.type = 'area';
    cfg.shapeType = 'area';
    cfg.generatePoints = true;
    cfg.sortable = true;
    return cfg;
  };

  _proto.draw = function draw(data, shapeFactory) {
    var self = this;
    var container = self.get('container');
    var cfg = this.getDrawCfg(data[0]);
    var yScale = self.getYScale();
    var connectNulls = self.get('connectNulls');
    var splitArrayfn = (0, _util.splitArray)(data, yScale.field, connectNulls);
    cfg.origin = data;
    (0, _common.each)(splitArrayfn, function (subData, splitedIndex) {
      cfg.splitedIndex = splitedIndex;
      var points = subData.map(function (obj) {
        return obj.points;
      });
      cfg.points = points;
      self.drawShape(cfg.shape, data[0], cfg, container, shapeFactory);
    });
  };

  return Area;
}(_base["default"]);

_base["default"].Area = Area;
var _default = Area;
exports["default"] = _default;