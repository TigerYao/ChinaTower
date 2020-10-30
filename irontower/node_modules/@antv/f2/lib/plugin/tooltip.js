"use strict";

exports.__esModule = true;
exports.init = init;
exports.afterGeomDraw = afterGeomDraw;
exports.clearInner = clearInner;
exports["default"] = void 0;

var _common = require("../util/common");

var _global = _interopRequireDefault(require("../global"));

var _tooltip = _interopRequireDefault(require("../component/tooltip"));

var _helper = require("../util/helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Register the default configuration for Tooltip
_global["default"].tooltip = (0, _common.deepMix)({
  triggerOn: 'press',
  triggerOff: 'pressend',
  alwaysShow: false,
  showTitle: false,
  showCrosshairs: false,
  crosshairsStyle: {
    stroke: 'rgba(0, 0, 0, 0.25)',
    lineWidth: 1
  },
  showTooltipMarker: true,
  background: {
    radius: 1,
    fill: 'rgba(0, 0, 0, 0.65)',
    padding: [3, 5]
  },
  titleStyle: {
    fontSize: 12,
    fill: '#fff',
    textAlign: 'start',
    textBaseline: 'top'
  },
  nameStyle: {
    fontSize: 12,
    fill: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'start',
    textBaseline: 'middle'
  },
  valueStyle: {
    fontSize: 12,
    fill: '#fff',
    textAlign: 'start',
    textBaseline: 'middle'
  },
  showItemMarker: true,
  itemMarkerStyle: {
    radius: 3,
    symbol: 'circle',
    lineWidth: 1,
    stroke: '#fff'
  },
  layout: 'horizontal',
  snap: false
}, _global["default"].tooltip || {});

function _getTooltipValueScale(geom) {
  var colorAttr = geom.getAttr('color');

  if (colorAttr) {
    var colorScale = colorAttr.getScale(colorAttr.type);

    if (colorScale.isLinear) {
      return colorScale;
    }
  }

  var xScale = geom.getXScale();
  var yScale = geom.getYScale();

  if (yScale) {
    return yScale;
  }

  return xScale;
}

function getTooltipName(geom, origin) {
  var name;
  var nameScale;

  var groupScales = geom._getGroupScales();

  if (groupScales.length) {
    (0, _common.each)(groupScales, function (scale) {
      nameScale = scale;
      return false;
    });
  }

  if (nameScale) {
    var field = nameScale.field;
    name = nameScale.getText(origin[field]);
  } else {
    var valueScale = _getTooltipValueScale(geom);

    name = valueScale.alias || valueScale.field;
  }

  return name;
}

function getTooltipValue(geom, origin) {
  var scale = _getTooltipValueScale(geom);

  return scale.getText(origin[scale.field]);
}

function getTooltipTitle(geom, origin) {
  var position = geom.getAttr('position');
  var field = position.getFields()[0];
  var scale = geom.get('scales')[field];
  return scale.getText(origin[scale.field]);
}

function _indexOfArray(items, item) {
  var rst = -1;
  (0, _common.each)(items, function (sub, index) {
    if (sub.title === item.title && sub.name === item.name && sub.value === item.value && sub.color === item.color) {
      rst = index;
      return false;
    }
  });
  return rst;
}

function _uniqItems(items) {
  var tmp = [];
  (0, _common.each)(items, function (item) {
    var index = _indexOfArray(tmp, item);

    if (index === -1) {
      tmp.push(item);
    } else {
      tmp[index] = item;
    }
  });
  return tmp;
}

function isEqual(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

var TooltipController = /*#__PURE__*/function () {
  function TooltipController(cfg) {
    var _this = this;

    _defineProperty(this, "handleShowEvent", function (ev) {
      var chart = _this.chart;
      if (!_this.enable) return;
      var plot = chart.get('plotRange');
      var point = (0, _common.createEvent)(ev, chart);

      if (!(0, _helper.isPointInPlot)(point, plot) && !_this._tooltipCfg.alwaysShow) {
        // not in chart plot
        _this.hideTooltip();

        return;
      }

      var lastTimeStamp = _this.timeStamp;
      var timeStamp = +new Date();

      if (timeStamp - lastTimeStamp > 16) {
        _this.showTooltip(point);

        _this.timeStamp = timeStamp;
      }
    });

    _defineProperty(this, "handleHideEvent", function () {
      if (!_this.enable) return;

      _this.hideTooltip();
    });

    this.enable = true;
    this.cfg = {};
    this.tooltip = null;
    this.chart = null;
    this.timeStamp = 0;
    (0, _common.mix)(this, cfg);
    var _chart = this.chart;

    var canvas = _chart.get('canvas');

    this.canvas = canvas;
    this.canvasDom = canvas.get('el');
  }

  var _proto = TooltipController.prototype;

  _proto._setCrosshairsCfg = function _setCrosshairsCfg() {
    var self = this;
    var chart = self.chart;
    var defaultCfg = (0, _common.mix)({}, _global["default"].tooltip);
    var geoms = chart.get('geoms');
    var shapes = [];
    (0, _common.each)(geoms, function (geom) {
      var type = geom.get('type');

      if (shapes.indexOf(type) === -1) {
        shapes.push(type);
      }
    });
    var coordType = chart.get('coord').type;

    if (geoms.length && (coordType === 'cartesian' || coordType === 'rect')) {
      if (shapes.length === 1 && ['line', 'area', 'path', 'point'].indexOf(shapes[0]) !== -1) {
        (0, _common.mix)(defaultCfg, {
          showCrosshairs: true
        });
      }
    }

    return defaultCfg;
  };

  _proto._getMaxLength = function _getMaxLength(cfg) {
    if (cfg === void 0) {
      cfg = {};
    }

    var _cfg = cfg,
        layout = _cfg.layout,
        plotRange = _cfg.plotRange;
    return layout === 'horizontal' ? plotRange.br.x - plotRange.bl.x : plotRange.bl.y - plotRange.tr.y;
  };

  _proto.render = function render() {
    var self = this;

    if (self.tooltip) {
      return;
    }

    var chart = self.chart;
    var canvas = chart.get('canvas');
    var frontPlot = chart.get('frontPlot').addGroup({
      className: 'tooltipContainer',
      zIndex: 10
    });
    var backPlot = chart.get('backPlot').addGroup({
      className: 'tooltipContainer'
    });
    var plotRange = chart.get('plotRange');
    var coord = chart.get('coord');

    var defaultCfg = self._setCrosshairsCfg();

    var cfg = self.cfg; // 通过 chart.tooltip() 接口传入的 tooltip 配置项

    var tooltipCfg = (0, _common.deepMix)({
      plotRange: plotRange,
      frontPlot: frontPlot,
      backPlot: backPlot,
      canvas: canvas,
      fixed: coord.transposed || coord.isPolar
    }, defaultCfg, cfg); // 创建 tooltip 实例需要的配置，不应该修改 this.cfg，即用户传入的配置

    tooltipCfg.maxLength = self._getMaxLength(tooltipCfg);
    this._tooltipCfg = tooltipCfg;
    var tooltip = new _tooltip["default"](tooltipCfg);
    self.tooltip = tooltip; // 需要保持tooltip一直显示

    if (tooltipCfg.alwaysShow && self.prePoint) {
      this.showTooltip(self.prePoint);
    }

    self.bindEvents();
  };

  _proto.clear = function clear() {
    var tooltip = this.tooltip;

    if (tooltip) {
      tooltip.destroy();
      this.unBindEvents();
    }

    this.tooltip = null;
    this._lastActive = null;
  };

  _proto._getTooltipMarkerStyle = function _getTooltipMarkerStyle(cfg) {
    if (cfg === void 0) {
      cfg = {};
    }

    var _cfg2 = cfg,
        type = _cfg2.type,
        items = _cfg2.items;
    var tooltipCfg = this._tooltipCfg;

    if (type === 'rect') {
      var x;
      var y;
      var width;
      var height;
      var chart = this.chart;

      var _chart$get = chart.get('plotRange'),
          tl = _chart$get.tl,
          br = _chart$get.br;

      var coord = chart.get('coord');
      var firstItem = items[0];
      var lastItem = items[items.length - 1];
      var intervalWidth = firstItem.width;

      if (coord.transposed) {
        x = tl.x;
        y = lastItem.y - intervalWidth * 0.75;
        width = br.x - tl.x;
        height = firstItem.y - lastItem.y + 1.5 * intervalWidth;
      } else {
        x = firstItem.x - intervalWidth * 0.75;
        y = tl.y;
        width = lastItem.x - firstItem.x + 1.5 * intervalWidth;
        height = br.y - tl.y;
      }

      cfg.style = (0, _common.mix)({
        x: x,
        y: y,
        width: width,
        height: height,
        fill: '#CCD6EC',
        opacity: 0.3
      }, tooltipCfg.tooltipMarkerStyle);
    } else {
      cfg.style = (0, _common.mix)({
        radius: 4,
        fill: '#fff',
        lineWidth: 2
      }, tooltipCfg.tooltipMarkerStyle);
    }

    return cfg;
  };

  _proto._setTooltip = function _setTooltip(point, items, tooltipMarkerCfg) {
    if (tooltipMarkerCfg === void 0) {
      tooltipMarkerCfg = {};
    }

    this.prePoint = point;
    var lastActive = this._lastActive;
    var tooltip = this.tooltip;
    var cfg = this._tooltipCfg;
    items = _uniqItems(items);
    var chart = this.chart;
    var coord = chart.get('coord');
    var yScale = chart.getYScales()[0];
    var snap = cfg.snap;

    if (snap === false && yScale.isLinear) {
      var invertPoint = coord.invertPoint(point);
      var plot = chart.get('plotRange');
      var tip;
      var pos;

      if ((0, _helper.isPointInPlot)(point, plot)) {
        if (coord.transposed) {
          tip = yScale.invert(invertPoint.x);
          pos = point.x;
          tooltip.setXTipContent(tip);
          tooltip.setXTipPosition(pos);
          tooltip.setYCrosshairPosition(pos);
        } else {
          tip = yScale.invert(invertPoint.y);
          pos = point.y;
          tooltip.setYTipContent(tip);
          tooltip.setYTipPosition(pos);
          tooltip.setXCrosshairPosition(pos);
        }
      }
    }

    if (cfg.onShow) {
      cfg.onShow({
        x: point.x,
        y: point.y,
        tooltip: tooltip,
        items: items,
        tooltipMarkerCfg: tooltipMarkerCfg
      });
    }

    if (isEqual(lastActive, items)) {
      if (snap === false && ((0, _common.directionEnabled)(cfg.crosshairsType, 'y') || cfg.showYTip)) {
        var canvas = this.chart.get('canvas');
        canvas.draw();
      }

      return;
    }

    this._lastActive = items;
    var onChange = cfg.onChange;

    if (onChange) {
      onChange({
        x: point.x,
        y: point.y,
        tooltip: tooltip,
        items: items,
        tooltipMarkerCfg: tooltipMarkerCfg
      });
    }

    var first = items[0];
    var title = first.title || first.name;
    var xTipPosX = first.x;

    if (items.length > 1) {
      xTipPosX = (items[0].x + items[items.length - 1].x) / 2;
    }

    tooltip.setContent(title, items, coord.transposed);
    tooltip.setPosition(items, point);

    if (coord.transposed) {
      var yTipPosY = first.y;

      if (items.length > 1) {
        yTipPosY = (items[0].y + items[items.length - 1].y) / 2;
      }

      tooltip.setYTipContent(title);
      tooltip.setYTipPosition(yTipPosY);
      tooltip.setXCrosshairPosition(yTipPosY);

      if (snap) {
        tooltip.setXTipContent(first.value);
        tooltip.setXTipPosition(xTipPosX);
        tooltip.setYCrosshairPosition(xTipPosX);
      }
    } else {
      tooltip.setXTipContent(title);
      tooltip.setXTipPosition(xTipPosX);
      tooltip.setYCrosshairPosition(xTipPosX);

      if (snap) {
        tooltip.setYTipContent(first.value);
        tooltip.setYTipPosition(first.y);
        tooltip.setXCrosshairPosition(first.y);
      }
    }

    var markerItems = tooltipMarkerCfg.items;

    if (cfg.showTooltipMarker && markerItems.length) {
      tooltipMarkerCfg = this._getTooltipMarkerStyle(tooltipMarkerCfg);
      tooltip.setMarkers(tooltipMarkerCfg);
    } else {
      tooltip.clearMarkers();
    }

    tooltip.show();
  };

  _proto.showTooltip = function showTooltip(point) {
    var self = this;
    var chart = self.chart;
    var tooltipMarkerType;
    var tooltipMarkerItems = [];
    var items = [];
    var cfg = self._tooltipCfg;
    var showItemMarker = cfg.showItemMarker,
        itemMarkerStyle = cfg.itemMarkerStyle,
        alwaysShow = cfg.alwaysShow;
    var marker;

    if (showItemMarker) {
      marker = itemMarkerStyle;
    }

    var geoms = chart.get('geoms');
    var coord = chart.get('coord');
    (0, _common.each)(geoms, function (geom) {
      if (geom.get('visible')) {
        var type = geom.get('type');
        var records = geom.getSnapRecords(point);
        var adjust = geom.get('adjust'); // 漏斗图和金子塔图tooltip位置有问题，暂时不开放显示

        if (type === 'interval' && adjust && adjust.type === 'symmetric') {
          return;
        }

        (0, _common.each)(records, function (record) {
          if (record.x && record.y) {
            var x = record.x,
                y = record.y,
                _origin = record._origin,
                color = record.color;
            var tooltipItem = {
              x: x,
              y: (0, _common.isArray)(y) ? y[1] : y,
              color: color || _global["default"].defaultColor,
              origin: _origin,
              name: getTooltipName(geom, _origin),
              value: getTooltipValue(geom, _origin),
              title: getTooltipTitle(geom, _origin)
            };

            if (marker) {
              tooltipItem.marker = (0, _common.mix)({
                fill: color || _global["default"].defaultColor
              }, marker);
            }

            items.push(tooltipItem);

            if (['line', 'area', 'path'].indexOf(type) !== -1) {
              tooltipMarkerType = 'circle';
              tooltipMarkerItems.push(tooltipItem);
            } else if (type === 'interval' && (coord.type === 'cartesian' || coord.type === 'rect')) {
              tooltipMarkerType = 'rect';
              tooltipItem.width = geom.getSize(record._origin);
              tooltipMarkerItems.push(tooltipItem);
            }
          }
        });
      }
    });

    if (items.length) {
      var tooltipMarkerCfg = {
        items: tooltipMarkerItems,
        type: tooltipMarkerType
      };

      self._setTooltip(point, items, tooltipMarkerCfg);

      return;
    }

    if (!alwaysShow) {
      self.hideTooltip();
    }
  };

  _proto.hideTooltip = function hideTooltip() {
    var cfg = this._tooltipCfg;
    this._lastActive = null;
    var tooltip = this.tooltip;

    if (tooltip) {
      tooltip.hide();

      if (cfg.onHide) {
        cfg.onHide({
          tooltip: tooltip
        });
      }

      var canvas = this.chart.get('canvas');
      canvas.draw();
    }
  };

  _proto._handleEvent = function _handleEvent(methodName, method, action) {
    var canvas = this.canvas;
    (0, _common.each)([].concat(methodName), function (aMethod) {
      if (action === 'bind') {
        canvas.on(aMethod, method);
      } else {
        canvas.off(aMethod, method);
      }
    });
  };

  _proto.bindEvents = function bindEvents() {
    var cfg = this._tooltipCfg;
    var triggerOn = cfg.triggerOn,
        triggerOff = cfg.triggerOff,
        alwaysShow = cfg.alwaysShow;
    triggerOn && this._handleEvent(triggerOn, this.handleShowEvent, 'bind'); // 如果 !alwaysShow, 则在手势离开后就隐藏

    if (!alwaysShow) {
      this._handleEvent(triggerOff, this.handleHideEvent, 'bind');
    }
  };

  _proto.unBindEvents = function unBindEvents() {
    var cfg = this._tooltipCfg;
    var triggerOn = cfg.triggerOn,
        triggerOff = cfg.triggerOff,
        alwaysShow = cfg.alwaysShow;
    triggerOn && this._handleEvent(triggerOn, this.handleShowEvent, 'unBind');

    if (!alwaysShow) {
      this._handleEvent(triggerOff, this.handleHideEvent, 'unBind');
    }
  };

  return TooltipController;
}();

function init(chart) {
  var tooltipController = new TooltipController({
    chart: chart
  });
  chart.set('tooltipController', tooltipController);

  chart.tooltip = function (enable, cfg) {
    if ((0, _common.isObject)(enable)) {
      cfg = enable;
      enable = true;
    }

    tooltipController.enable = enable;

    if (cfg) {
      tooltipController.cfg = cfg;
    }

    return this;
  };
}

function afterGeomDraw(chart) {
  var tooltipController = chart.get('tooltipController');
  tooltipController.render();

  chart.showTooltip = function (point) {
    tooltipController.showTooltip(point);
    return this;
  };

  chart.hideTooltip = function () {
    tooltipController.hideTooltip();
    return this;
  };
}

function clearInner(chart) {
  var tooltipController = chart.get('tooltipController');
  tooltipController.clear();
}

var _default = {
  init: init,
  afterGeomDraw: afterGeomDraw,
  clearInner: clearInner
};
exports["default"] = _default;