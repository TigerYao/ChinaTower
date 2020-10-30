"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../util/common");

var _base = _interopRequireDefault(require("./base"));

var _chart = _interopRequireDefault(require("../chart/chart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var PieSelect = /*#__PURE__*/function (_Interaction) {
  _inheritsLoose(PieSelect, _Interaction);

  var _proto = PieSelect.prototype;

  _proto.getDefaultCfg = function getDefaultCfg() {
    var defaultCfg = _Interaction.prototype.getDefaultCfg.call(this);

    defaultCfg = (0, _common.mix)({}, defaultCfg, {
      startEvent: 'tap',
      processEvent: null,
      animate: false,
      offset: 1,
      appendRadius: 8,
      style: {
        fillOpacity: 0.5
      },
      cancelable: true,
      defaultSelected: null // set the default selected shape

    });

    if (_common.isWx || _common.isMy) {
      // 小程序
      defaultCfg.startEvent = 'touchstart';
      defaultCfg.endEvent = 'touchend';
    }

    return defaultCfg;
  };

  function PieSelect(cfg, chart) {
    var _this;

    _this = _Interaction.call(this, cfg, chart) || this;

    var self = _assertThisInitialized(_this);

    chart.registerPlugins({
      clearInner: function clearInner() {
        self.halo && self.halo.remove(true);
        self.selected = false;
        self.selectedShape = null;
        self.lastShape = null;
        self.halo = null;
        self.defaultSelected = null;
      }
    });
    var defaultSelected = self.defaultSelected;

    if ((0, _common.isObject)(defaultSelected)) {
      var selectedShape = self._getSelectedShapeByData(defaultSelected);

      selectedShape && self._selectedShape(selectedShape);

      _this.canvas.draw();
    }

    return _this;
  }

  _proto._getSelectedShapeByData = function _getSelectedShapeByData(data) {
    var selectedShape = null;
    var chart = this.chart;
    var geom = chart.get('geoms')[0];
    var container = geom.get('container');
    var children = container.get('children');
    (0, _common.each)(children, function (child) {
      if (child.get('isShape') && child.get('className') === geom.get('type')) {
        // get geometry's shape
        var shapeData = child.get('origin')._origin;

        if ((0, _common.isObjectValueEqual)(shapeData, data)) {
          selectedShape = child;
          return false;
        }
      }
    });
    return selectedShape;
  };

  _proto._selectedShape = function _selectedShape(selectedShape) {
    var offset = this.offset,
        style = this.style,
        appendRadius = this.appendRadius,
        chart = this.chart;
    this.lastShape = selectedShape;
    var _selectedShape$_attrs = selectedShape._attrs.attrs,
        x = _selectedShape$_attrs.x,
        y = _selectedShape$_attrs.y,
        startAngle = _selectedShape$_attrs.startAngle,
        endAngle = _selectedShape$_attrs.endAngle,
        r = _selectedShape$_attrs.r,
        fill = _selectedShape$_attrs.fill;
    var frontPlot = chart.get('frontPlot');
    var halo = frontPlot.addShape('sector', {
      attrs: (0, _common.mix)({
        x: x,
        y: y,
        r: r + offset + appendRadius,
        r0: r + offset,
        fill: fill,
        startAngle: startAngle,
        endAngle: endAngle
      }, style)
    });
    this.halo = halo;
    var animate = this.animate;

    if (animate) {
      if (animate === true) {
        animate = {
          duration: 300
        };
      }

      halo.attr('r', r + offset);
      halo.animate().to((0, _common.mix)({
        attrs: {
          r: r + offset + appendRadius
        }
      }, animate));
    }
  };

  _proto.start = function start(ev) {
    var chart = this.chart;

    if (ev.type === 'tap') {
      ev.clientX = ev.center.x;
      ev.clientY = ev.center.y;
    }

    var _createEvent = (0, _common.createEvent)(ev, chart),
        x = _createEvent.x,
        y = _createEvent.y;

    var records = chart.getSnapRecords({
      x: x,
      y: y
    });

    if (!records.length) {
      this.selected = false;
      this.selectedShape = null;
      return;
    }

    var data = records[0]._origin;

    var selectedShape = this._getSelectedShapeByData(data);

    var lastShape = this.lastShape;
    this.selectedShape = selectedShape;
    this.selected = true;

    if (selectedShape === lastShape) {
      if (!this.cancelable) {
        return;
      }

      this.halo && this.halo.remove(true);
      this.lastShape = null;
      this.selected = false;
    } else {
      this.halo && this.halo.remove(true);

      this._selectedShape(selectedShape);
    }

    this.canvas.draw();
  };

  _proto.end = function end(ev) {
    var selectedShape = this.selectedShape;

    if (selectedShape && !selectedShape.get('destroyed')) {
      ev.data = selectedShape.get('origin')._origin;
      ev.shapeInfo = selectedShape.get('origin');
      ev.shape = selectedShape;
      ev.selected = !!this.selected;
    }
  };

  return PieSelect;
}(_base["default"]);

_chart["default"].registerInteraction('pie-select', PieSelect);

var _default = PieSelect;
exports["default"] = _default;