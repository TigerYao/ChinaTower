"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

var _common = require("../util/common");

var _size = _interopRequireDefault(require("./mixin/size"));

require("./shape/interval");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Interval = /*#__PURE__*/function (_Geom) {
  _inheritsLoose(Interval, _Geom);

  var _proto = Interval.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Geom.prototype.getDefaultCfg.call(this);

    cfg.type = 'interval';
    cfg.shapeType = 'interval';
    cfg.generatePoints = true;
    return cfg;
  };

  function Interval(cfg) {
    var _this;

    _this = _Geom.call(this, cfg) || this;
    (0, _common.mix)(_assertThisInitialized(_this), _size["default"]);
    return _this;
  }

  _proto.init = function init() {
    _Geom.prototype.init.call(this); // 绑定事件


    this.initEvent();
  };

  _proto.createShapePointsCfg = function createShapePointsCfg(obj) {
    var cfg = _Geom.prototype.createShapePointsCfg.call(this, obj);

    cfg.size = this.getNormalizedSize(obj);
    return cfg;
  };

  _proto.clearInner = function clearInner() {
    _Geom.prototype.clearInner.call(this);

    this.set('defaultSize', null);
  };

  return Interval;
}(_base["default"]);

_base["default"].Interval = Interval;
var _default = Interval;
exports["default"] = _default;