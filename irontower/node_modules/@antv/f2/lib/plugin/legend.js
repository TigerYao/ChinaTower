"use strict";

exports.__esModule = true;
exports.init = init;
exports.beforeGeomDraw = beforeGeomDraw;
exports.afterGeomDraw = afterGeomDraw;
exports.clearInner = clearInner;
exports["default"] = void 0;

var _common = require("../util/common");

var _list = _interopRequireDefault(require("../component/list"));

var _global = _interopRequireDefault(require("../global"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LEGEND_GAP = 12;
var MARKER_SIZE = 3;
var DEFAULT_CFG = {
  itemMarginBottom: 12,
  itemGap: 10,
  showTitle: false,
  titleStyle: {
    fontSize: 12,
    fill: '#808080',
    textAlign: 'start',
    textBaseline: 'top'
  },
  nameStyle: {
    fill: '#808080',
    fontSize: 12,
    textAlign: 'start',
    textBaseline: 'middle'
  },
  valueStyle: {
    fill: '#000000',
    fontSize: 12,
    textAlign: 'start',
    textBaseline: 'middle'
  },
  unCheckStyle: {
    fill: '#bfbfbf'
  },
  itemWidth: 'auto',
  wordSpace: 6,
  selectedMode: 'multiple' // 'multiple' or 'single'

}; // Register the default configuration for Legend

_global["default"].legend = (0, _common.deepMix)({
  common: DEFAULT_CFG,
  // common legend configuration
  right: (0, _common.mix)({
    position: 'right',
    layout: 'vertical'
  }, DEFAULT_CFG),
  left: (0, _common.mix)({
    position: 'left',
    layout: 'vertical'
  }, DEFAULT_CFG),
  top: (0, _common.mix)({
    position: 'top',
    layout: 'horizontal'
  }, DEFAULT_CFG),
  bottom: (0, _common.mix)({
    position: 'bottom',
    layout: 'horizontal'
  }, DEFAULT_CFG)
}, _global["default"].legend || {});

function getPaddingByPos(pos, appendPadding) {
  var padding = 0;
  appendPadding = (0, _common.parsePadding)(appendPadding);

  switch (pos) {
    case 'top':
      padding = appendPadding[0];
      break;

    case 'right':
      padding = appendPadding[1];
      break;

    case 'bottom':
      padding = appendPadding[2];
      break;

    case 'left':
      padding = appendPadding[3];
      break;

    default:
      break;
  }

  return padding;
}

var LegendController = /*#__PURE__*/function () {
  function LegendController(cfg) {
    var _this = this;

    _defineProperty(this, "handleEvent", function (ev) {
      var self = _this;

      function findItem(x, y) {
        var result = null;
        var legends = self.legends;
        (0, _common.each)(legends, function (legendItems) {
          (0, _common.each)(legendItems, function (legend) {
            var itemsGroup = legend.itemsGroup,
                legendHitBoxes = legend.legendHitBoxes;
            var children = itemsGroup.get('children');

            if (children.length) {
              var legendPosX = legend.x;
              var legendPosY = legend.y;
              (0, _common.each)(legendHitBoxes, function (box, index) {
                if (x >= box.x + legendPosX && x <= box.x + box.width + legendPosX && y >= box.y + legendPosY && y <= box.height + box.y + legendPosY) {
                  // inbox
                  result = {
                    clickedItem: children[index],
                    clickedLegend: legend
                  };
                  return false;
                }
              });
            }
          });
        });
        return result;
      }

      var chart = self.chart;

      var _createEvent = (0, _common.createEvent)(ev, chart),
          x = _createEvent.x,
          y = _createEvent.y;

      var clicked = findItem(x, y);

      if (clicked && clicked.clickedLegend.clickable !== false) {
        var clickedItem = clicked.clickedItem,
            clickedLegend = clicked.clickedLegend;

        if (clickedLegend.onClick) {
          ev.clickedItem = clickedItem;
          clickedLegend.onClick(ev);
        } else if (!clickedLegend.custom) {
          var checked = clickedItem.get('checked');
          var value = clickedItem.get('dataValue');
          var filteredVals = clickedLegend.filteredVals,
              field = clickedLegend.field,
              selectedMode = clickedLegend.selectedMode;
          var isSingeSelected = selectedMode === 'single';

          if (isSingeSelected) {
            chart.filter(field, function (val) {
              return val === value;
            });
          } else {
            if (checked) {
              filteredVals.push(value);
            } else {
              _common.Array.remove(filteredVals, value);
            }

            chart.filter(field, function (val) {
              return filteredVals.indexOf(val) === -1;
            });
          }

          chart.repaint();
        }
      }
    });

    this.legendCfg = {};
    this.enable = true;
    this.position = 'top';
    (0, _common.mix)(this, cfg);
    var _chart = this.chart;
    this.canvasDom = _chart.get('canvas').get('el');
    this.clear();
  }

  var _proto = LegendController.prototype;

  _proto.addLegend = function addLegend(scale, items, filteredVals) {
    var self = this;
    var legendCfg = self.legendCfg;
    var field = scale.field;
    var fieldCfg = legendCfg[field];

    if (fieldCfg === false) {
      return null;
    }

    if (fieldCfg && fieldCfg.custom) {
      self.addCustomLegend(field);
    } else {
      var position = legendCfg.position || self.position;

      if (fieldCfg && fieldCfg.position) {
        position = fieldCfg.position;
      }

      if (scale.isCategory) {
        self._addCategoryLegend(scale, items, position, filteredVals);
      }
    }
  };

  _proto.addCustomLegend = function addCustomLegend(field) {
    var self = this;
    var legendCfg = self.legendCfg;

    if (field && legendCfg[field]) {
      legendCfg = legendCfg[field];
    }

    var position = legendCfg.position || self.position;
    var legends = self.legends;
    legends[position] = legends[position] || [];
    var items = legendCfg.items;

    if (!items) {
      return null;
    }

    var container = self.container;
    (0, _common.each)(items, function (item) {
      if (!(0, _common.isPlainObject)(item.marker)) {
        item.marker = {
          symbol: item.marker || 'circle',
          fill: item.fill,
          radius: MARKER_SIZE
        };
      } else {
        item.marker.radius = item.marker.radius || MARKER_SIZE;
      }

      item.checked = (0, _common.isNil)(item.checked) ? true : item.checked;
      item.name = item.name || item.value;
    });
    var legend = new _list["default"]((0, _common.deepMix)({}, _global["default"].legend[position], legendCfg, {
      maxLength: self._getMaxLength(position),
      items: items,
      parent: container
    }));
    legends[position].push(legend);
  };

  _proto.clear = function clear() {
    var legends = this.legends;
    (0, _common.each)(legends, function (legendItems) {
      (0, _common.each)(legendItems, function (legend) {
        legend.clear();
      });
    });
    this.legends = {};
    this.unBindEvents();
  };

  _proto._isFiltered = function _isFiltered(scale, values, value) {
    var rst = false;
    (0, _common.each)(values, function (val) {
      rst = rst || scale.getText(val) === scale.getText(value);

      if (rst) {
        return false;
      }
    });
    return rst;
  };

  _proto._getMaxLength = function _getMaxLength(position) {
    var chart = this.chart;
    var appendPadding = (0, _common.parsePadding)(chart.get('appendPadding'));
    return position === 'right' || position === 'left' ? chart.get('height') - (appendPadding[0] + appendPadding[2]) : chart.get('width') - (appendPadding[1] + appendPadding[3]);
  };

  _proto._addCategoryLegend = function _addCategoryLegend(scale, items, position, filteredVals) {
    var self = this;
    var legendCfg = self.legendCfg,
        legends = self.legends,
        container = self.container,
        chart = self.chart;
    var field = scale.field;
    legends[position] = legends[position] || [];
    var symbol = 'circle';

    if (legendCfg[field] && legendCfg[field].marker) {
      symbol = legendCfg[field].marker;
    } else if (legendCfg.marker) {
      symbol = legendCfg.marker;
    }

    (0, _common.each)(items, function (item) {
      if ((0, _common.isPlainObject)(symbol)) {
        (0, _common.mix)(item.marker, symbol);
      } else {
        item.marker.symbol = symbol;
      }

      if (filteredVals) {
        item.checked = !self._isFiltered(scale, filteredVals, item.dataValue);
      }
    });
    var legendItems = chart.get('legendItems');
    legendItems[field] = items;
    var lastCfg = (0, _common.deepMix)({}, _global["default"].legend[position], legendCfg[field] || legendCfg, {
      maxLength: self._getMaxLength(position),
      items: items,
      field: field,
      filteredVals: filteredVals,
      parent: container
    });

    if (lastCfg.showTitle) {
      (0, _common.deepMix)(lastCfg, {
        title: scale.alias || scale.field
      });
    }

    var legend = new _list["default"](lastCfg);
    legends[position].push(legend);
    return legend;
  };

  _proto._alignLegend = function _alignLegend(legend, pre, position) {
    var self = this;
    var _self$plotRange = self.plotRange,
        tl = _self$plotRange.tl,
        bl = _self$plotRange.bl;
    var chart = self.chart;
    var offsetX = legend.offsetX || 0;
    var offsetY = legend.offsetY || 0;
    var chartWidth = chart.get('width');
    var chartHeight = chart.get('height');
    var appendPadding = (0, _common.parsePadding)(chart.get('appendPadding'));
    var legendHeight = legend.getHeight();
    var legendWidth = legend.getWidth();
    var x = 0;
    var y = 0;

    if (position === 'left' || position === 'right') {
      var verticalAlign = legend.verticalAlign || 'middle';
      var height = Math.abs(tl.y - bl.y);
      x = position === 'left' ? appendPadding[3] : chartWidth - legendWidth - appendPadding[1];
      y = (height - legendHeight) / 2 + tl.y;

      if (verticalAlign === 'top') {
        y = tl.y;
      } else if (verticalAlign === 'bottom') {
        y = bl.y - legendHeight;
      }

      if (pre) {
        y = pre.get('y') - legendHeight - LEGEND_GAP;
      }
    } else {
      var align = legend.align || 'left';
      x = appendPadding[3];

      if (align === 'center') {
        x = chartWidth / 2 - legendWidth / 2;
      } else if (align === 'right') {
        x = chartWidth - (legendWidth + appendPadding[1]);
      }

      y = position === 'top' ? appendPadding[0] + Math.abs(legend.container.getBBox().minY) : chartHeight - legendHeight;

      if (pre) {
        var preWidth = pre.getWidth();
        x = pre.x + preWidth + LEGEND_GAP;
      }
    }

    if (position === 'bottom' && offsetY > 0) {
      offsetY = 0;
    }

    if (position === 'right' && offsetX > 0) {
      offsetX = 0;
    }

    legend.moveTo(x + offsetX, y + offsetY);
  };

  _proto.alignLegends = function alignLegends() {
    var self = this;
    var legends = self.legends;
    (0, _common.each)(legends, function (legendItems, position) {
      (0, _common.each)(legendItems, function (legend, index) {
        var pre = legendItems[index - 1];

        self._alignLegend(legend, pre, position);
      });
    });
    return self;
  };

  _proto.bindEvents = function bindEvents() {
    var legendCfg = this.legendCfg;
    var triggerOn = legendCfg.triggerOn || 'touchstart';
    (0, _common.addEventListener)(this.canvasDom, triggerOn, this.handleEvent);
  };

  _proto.unBindEvents = function unBindEvents() {
    var legendCfg = this.legendCfg;
    var triggerOn = legendCfg.triggerOn || 'touchstart';
    (0, _common.removeEventListener)(this.canvasDom, triggerOn, this.handleEvent);
  };

  return LegendController;
}();

function init(chart) {
  var legendController = new LegendController({
    container: chart.get('backPlot'),
    plotRange: chart.get('plotRange'),
    chart: chart
  });
  chart.set('legendController', legendController);

  chart.legend = function (field, cfg) {
    var legendCfg = legendController.legendCfg;
    legendController.enable = true;

    if ((0, _common.isBoolean)(field)) {
      legendController.enable = field;
      legendCfg = cfg || {};
    } else if ((0, _common.isObject)(field)) {
      legendCfg = field;
    } else {
      legendCfg[field] = cfg;
    }

    legendController.legendCfg = legendCfg;
    return this;
  };
}

function beforeGeomDraw(chart) {
  var legendController = chart.get('legendController');
  if (!legendController.enable) return null; // legend is not displayed

  var legendCfg = legendController.legendCfg;

  if (legendCfg && legendCfg.custom) {
    legendController.addCustomLegend();
  } else {
    var legendItems = chart.getLegendItems();
    var scales = chart.get('scales');
    var filters = chart.get('filters');
    (0, _common.each)(legendItems, function (items, field) {
      var scale = scales[field];
      var values = scale.values;
      var filteredVals;

      if (filters && filters[field]) {
        filteredVals = values.filter(function (v) {
          return !filters[field](v);
        });
      } else {
        filteredVals = [];
      }

      legendController.addLegend(scale, items, filteredVals);
    });
  }

  if (legendCfg && legendCfg.clickable !== false) {
    legendController.bindEvents();
  }

  var legends = legendController.legends;
  var legendRange = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  (0, _common.each)(legends, function (legendItems, position) {
    var padding = 0;
    (0, _common.each)(legendItems, function (legend) {
      var width = legend.getWidth();
      var height = legend.getHeight();

      if (position === 'top' || position === 'bottom') {
        padding = Math.max(padding, height);

        if (legend.offsetY > 0) {
          padding += legend.offsetY;
        }
      } else {
        padding = Math.max(padding, width);

        if (legend.offsetX > 0) {
          padding += legend.offsetX;
        }
      }
    });
    legendRange[position] = padding + getPaddingByPos(position, chart.get('appendPadding'));
  });
  chart.set('legendRange', legendRange);
}

function afterGeomDraw(chart) {
  var legendController = chart.get('legendController');
  legendController.alignLegends();
}

function clearInner(chart) {
  var legendController = chart.get('legendController');
  legendController.clear();
  chart.set('legendRange', null);
}

var _default = {
  init: init,
  beforeGeomDraw: beforeGeomDraw,
  afterGeomDraw: afterGeomDraw,
  clearInner: clearInner
};
exports["default"] = _default;