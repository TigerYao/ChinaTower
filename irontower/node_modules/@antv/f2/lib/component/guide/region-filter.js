"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _rect = _interopRequireDefault(require("../../graphic/shape/rect"));

var _common = require("../../util/common");

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var RegionFilter = /*#__PURE__*/function (_GuideBase) {
  _inheritsLoose(RegionFilter, _GuideBase);

  function RegionFilter() {
    return _GuideBase.apply(this, arguments) || this;
  }

  var _proto = RegionFilter.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    this.type = 'regionFilter';
    this.start = [];
    this.end = [];
    this.color = null;
    this.style = null;
  };

  _proto.render = function render(coord) {
    var start = this.parsePoint(coord, this.start);
    var end = this.parsePoint(coord, this.end);

    if (!start || !end) {
      return;
    }

    var clip = new _rect["default"]({
      attrs: {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y)
      }
    }); // 新建剪切区域

    this.clip = clip;
    var chart = this.chart;
    var color = this.color;
    var style = this.style || {};
    var regionElements = [];
    var geoms = chart.get('geoms');
    geoms.map(function (geom) {
      var geomContainer = geom.get('container');
      var children = geomContainer.get('children');
      var group = geomContainer.addGroup({
        zIndex: 10,
        className: 'guide-region-filter'
      });
      children.map(function (c) {
        if (c.get('isShape')) {
          var type = c.get('type');
          var attrs = (0, _common.mix)({}, c.get('attrs'), style);

          if (color && (attrs.fill || attrs.fillStyle)) {
            attrs.fill = attrs.fillStyle = color;
          }

          if (color && (attrs.stroke || attrs.strokeStyle)) {
            attrs.stroke = attrs.strokeStyle = color;
          }

          var cfg = {
            attrs: attrs
          };

          if (type === 'custom' || type === 'Custom') {
            // custom 类型的 shape 会自定义绘制 path 的逻辑
            cfg.createPath = c.get('createPath');
            cfg.calculateBox = c.get('calculateBox');
          }

          group.addShape(type, cfg);
        }

        return c;
      });
      group.attr('clip', clip);
      geomContainer.sort();
      regionElements.push(group);
      return geom;
    });
    this.element = regionElements;
  };

  _proto.remove = function remove() {
    var element = this.element;
    (0, _common.each)(element, function (group) {
      group && group.remove(true);
    });
    this.clip && this.clip.remove(true);
  };

  return RegionFilter;
}(_base["default"]);

_base["default"].RegionFilter = RegionFilter;
var _default = RegionFilter;
exports["default"] = _default;