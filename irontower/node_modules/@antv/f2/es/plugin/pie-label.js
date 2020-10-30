function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { mix, isFunction, createEvent, each, isObjectValueEqual, deepMix, addEventListener, removeEventListener } from '../util/common';
import { Group } from '../graphic/';
var DEFAULT_CFG = {
  anchorOffset: 5,
  // 锚点的偏移量
  inflectionOffset: 15,
  // 拐点的偏移量
  sidePadding: 20,
  // 文本距离画布四边的距离
  lineHeight: 32,
  // 文本的行高
  adjustOffset: 15,
  // 发生调整时的偏移量
  skipOverlapLabels: false,
  // 是否不展示重叠的文本
  triggerOn: 'touchstart',
  // 点击行为触发的时间类型
  activeShape: false,
  // 当有图形被选中的时候，是否激活图形
  activeStyle: {
    offset: 1,
    appendRadius: 8,
    fillOpacity: 0.5
  },
  label1OffsetY: -1,
  label2OffsetY: 1
};

function getEndPoint(center, angle, r) {
  return {
    x: center.x + r * Math.cos(angle),
    y: center.y + r * Math.sin(angle)
  };
} // 计算中间角度


function getMiddleAngle(startAngle, endAngle) {
  if (endAngle < startAngle) {
    endAngle += Math.PI * 2;
  }

  return (endAngle + startAngle) / 2;
} // 判断两个矩形是否相交


function isOverlap(label1, label2) {
  var label1BBox = label1.getBBox();
  var label2BBox = label2.getBBox();
  return Math.max(label1BBox.minX, label2BBox.minX) <= Math.min(label1BBox.maxX, label2BBox.maxX) && Math.max(label1BBox.minY, label2BBox.minY) <= Math.min(label1BBox.maxY, label2BBox.maxY);
}

class controller {
  constructor(cfg) {
    var _this = this;

    _defineProperty(this, "_handleEvent", function (ev) {
      var self = _this;
      var {
        chart,
        drawnLabels,
        pieLabelCfg
      } = self;
      var {
        onClick,
        activeShape
      } = pieLabelCfg;
      var canvasEvent = createEvent(ev, chart);
      var {
        x,
        y
      } = canvasEvent; // 查找被点击的 label

      var clickedShape;

      for (var i = 0, len = drawnLabels.length; i < len; i++) {
        var shape = drawnLabels[i];
        var bbox = shape.getBBox(); // 通过最小包围盒来判断击中情况

        if (x >= bbox.minX && x <= bbox.maxX && y >= bbox.minY && y <= bbox.maxY) {
          clickedShape = shape;
          break;
        }
      }

      var pieData = chart.getSnapRecords({
        x,
        y
      });

      if (clickedShape) {
        canvasEvent.data = clickedShape.get('data');
      } else if (pieData.length) {
        // 击中饼图扇形区域
        canvasEvent.data = pieData[0]._origin;
      }

      onClick && onClick(canvasEvent);
      canvasEvent.data && activeShape && _this._activeShape(canvasEvent.data);
    });

    mix(this, cfg);
    var _chart = this.chart;
    this.canvasDom = _chart.get('canvas').get('el');
  }

  renderLabels() {
    var self = this;
    var {
      chart,
      pieLabelCfg,
      labelGroup
    } = self;
    var halves = [[], // left
    [] // right
    ]; // 存储左右 labels

    var geom = chart.get('geoms')[0];
    var shapes = geom.get('container').get('children');
    var {
      anchorOffset,
      inflectionOffset,
      label1,
      label2,
      lineHeight,
      skipOverlapLabels,
      label1OffsetY,
      label2OffsetY
    } = pieLabelCfg;
    var coord = chart.get('coord');
    var {
      center,
      circleRadius: radius
    } = coord;
    shapes.forEach(function (shape) {
      var {
        startAngle,
        endAngle
      } = shape._attrs.attrs;
      var middleAngle = getMiddleAngle(startAngle, endAngle);
      var anchorPoint = getEndPoint(center, middleAngle, radius + anchorOffset);
      var inflectionPoint = getEndPoint(center, middleAngle, radius + inflectionOffset);
      var origin = shape.get('origin');
      var {
        _origin,
        color
      } = origin;
      var label = {
        _anchor: anchorPoint,
        _inflection: inflectionPoint,
        _data: _origin,
        x: inflectionPoint.x,
        y: inflectionPoint.y,
        r: radius + inflectionOffset,
        fill: color
      };
      var textGroup = new Group({
        context: chart.get('canvas').get('context'),
        // 兼容 node、小程序环境
        data: _origin // 存储原始数据

      });
      var textAttrs = {
        x: 0,
        y: 0,
        fontSize: 12,
        lineHeight: 12,
        fill: '#808080'
      };

      if (isFunction(label1)) {
        textGroup.addShape('Text', {
          attrs: mix({
            textBaseline: 'bottom'
          }, textAttrs, label1(_origin, color)),
          data: _origin,
          // 存储原始数据
          offsetY: label1OffsetY
        });
      }

      if (isFunction(label2)) {
        textGroup.addShape('Text', {
          attrs: mix({
            textBaseline: 'top'
          }, textAttrs, label2(_origin, color)),
          data: _origin,
          // 存储原始数据
          offsetY: label2OffsetY
        });
      }

      label.textGroup = textGroup; // 判断文本的方向

      if (anchorPoint.x < center.x) {
        label._side = 'left';
        halves[0].push(label);
      } else {
        label._side = 'right';
        halves[1].push(label);
      }
    });
    var drawnLabels = [];

    if (skipOverlapLabels) {
      var lastLabel; // 存储上一个 label 对象，用于检测文本是否重叠

      var labels = halves[1].concat(halves[0]); // 顺时针

      for (var i = 0, len = labels.length; i < len; i++) {
        var label = labels[i];

        var textGroup = self._drawLabel(label);

        if (lastLabel) {
          if (isOverlap(textGroup, lastLabel)) {
            // 重叠了就不绘制
            continue;
          }
        }

        labelGroup.add(textGroup);

        self._drawLabelLine(label);

        lastLabel = textGroup;
        drawnLabels.push(textGroup);
      }
    } else {
      var height = chart.get('height');
      var maxCountForOneSide = parseInt(height / lineHeight, 10);
      halves.forEach(function (half) {
        if (half.length > maxCountForOneSide) {
          half.splice(maxCountForOneSide, half.length - maxCountForOneSide);
        }

        half.sort(function (a, b) {
          return a.y - b.y;
        });

        var labels = self._antiCollision(half);

        drawnLabels = drawnLabels.concat(labels);
      });
    }

    this.drawnLabels = drawnLabels;
  }

  bindEvents() {
    var pieLabelCfg = this.pieLabelCfg;
    var triggerOn = pieLabelCfg.triggerOn || 'touchstart';
    addEventListener(this.canvasDom, triggerOn, this._handleEvent);
  }

  unBindEvents() {
    var pieLabelCfg = this.pieLabelCfg;
    var triggerOn = pieLabelCfg.triggerOn || 'touchstart';
    removeEventListener(this.canvasDom, triggerOn, this._handleEvent);
  }

  clear() {
    this.labelGroup && this.labelGroup.clear();
    this.halo && this.halo.remove(true);
    this.lastSelectedData = null;
    this.drawnLabels = [];
    this.unBindEvents();
  }

  _drawLabel(label) {
    var {
      pieLabelCfg,
      chart
    } = this;
    var canvasWidth = chart.get('width');
    var {
      sidePadding
    } = pieLabelCfg;
    var {
      y,
      textGroup
    } = label;
    var children = textGroup.get('children');
    var textAttrs = {
      textAlign: label._side === 'left' ? 'left' : 'right',
      x: label._side === 'left' ? sidePadding : canvasWidth - sidePadding
    };
    children.forEach(function (child) {
      child.attr(textAttrs);
      child.attr('y', y + child.get('offsetY'));
    });
    return textGroup;
  }

  _drawLabelLine(label, maxLabelWidth) {
    var {
      chart,
      pieLabelCfg,
      labelGroup
    } = this;
    var canvasWidth = chart.get('width');
    var {
      sidePadding,
      adjustOffset,
      lineStyle,
      anchorStyle,
      skipOverlapLabels
    } = pieLabelCfg;
    var {
      _anchor,
      _inflection,
      fill,
      y
    } = label;
    var lastPoint = {
      x: label._side === 'left' ? sidePadding : canvasWidth - sidePadding,
      y
    };
    var points = [_anchor, _inflection, lastPoint];

    if (!skipOverlapLabels && _inflection.y !== y) {
      // 展示全部文本文本位置做过调整
      if (_inflection.y < y) {
        // 文本被调整下去了，则添加拐点连接线
        var point1 = _inflection;
        var point2 = {
          x: label._side === 'left' ? lastPoint.x + maxLabelWidth + adjustOffset : lastPoint.x - maxLabelWidth - adjustOffset,
          y: _inflection.y
        };
        var point3 = {
          x: label._side === 'left' ? lastPoint.x + maxLabelWidth : lastPoint.x - maxLabelWidth,
          y: lastPoint.y
        };
        points = [_anchor, point1, point2, point3, lastPoint];

        if (label._side === 'right' && point2.x < point1.x || label._side === 'left' && point2.x > point1.x) {
          points = [_anchor, point3, lastPoint];
        }
      } else {
        points = [_anchor, {
          x: _inflection.x,
          y
        }, lastPoint];
      }
    }

    labelGroup.addShape('Polyline', {
      attrs: mix({
        points,
        lineWidth: 1,
        stroke: fill
      }, lineStyle)
    }); // 绘制锚点

    labelGroup.addShape('Circle', {
      attrs: mix({
        x: _anchor.x,
        y: _anchor.y,
        r: 2,
        fill
      }, anchorStyle)
    });
  }

  _antiCollision(half) {
    var self = this;
    var {
      chart,
      pieLabelCfg
    } = self;
    var coord = chart.get('coord');
    var canvasHeight = chart.get('height');
    var {
      center,
      circleRadius: r
    } = coord;
    var {
      inflectionOffset,
      lineHeight
    } = pieLabelCfg;
    var startY = center.y - r - inflectionOffset - lineHeight;
    var overlapping = true;
    var totalH = canvasHeight;
    var i;
    var maxY = 0;
    var minY = Number.MIN_VALUE;
    var maxLabelWidth = 0;
    var boxes = half.map(function (label) {
      var labelY = label.y;

      if (labelY > maxY) {
        maxY = labelY;
      }

      if (labelY < minY) {
        minY = labelY;
      }

      var textGroup = label.textGroup;
      var labelWidth = textGroup.getBBox().width;

      if (labelWidth >= maxLabelWidth) {
        maxLabelWidth = labelWidth;
      }

      return {
        size: lineHeight,
        targets: [labelY - startY]
      };
    });

    if (maxY - startY > totalH) {
      totalH = maxY - startY;
    }

    var iteratorBoxed = function iteratorBoxed(boxes) {
      boxes.forEach(function (box) {
        var target = (Math.min.apply(minY, box.targets) + Math.max.apply(minY, box.targets)) / 2;
        box.pos = Math.min(Math.max(minY, target - box.size / 2), totalH - box.size);
      });
    };

    while (overlapping) {
      iteratorBoxed(boxes); // detect overlapping and join boxes

      overlapping = false;
      i = boxes.length;

      while (i--) {
        if (i > 0) {
          var previousBox = boxes[i - 1];
          var box = boxes[i];

          if (previousBox.pos + previousBox.size > box.pos) {
            // overlapping
            previousBox.size += box.size;
            previousBox.targets = previousBox.targets.concat(box.targets); // overflow, shift up

            if (previousBox.pos + previousBox.size > totalH) {
              previousBox.pos = totalH - previousBox.size;
            }

            boxes.splice(i, 1); // removing box

            overlapping = true;
          }
        }
      }
    }

    i = 0;
    boxes.forEach(function (b) {
      var posInCompositeBox = startY; // middle of the label

      b.targets.forEach(function () {
        half[i].y = b.pos + posInCompositeBox + lineHeight / 2;
        posInCompositeBox += lineHeight;
        i++;
      });
    });
    var drawnLabels = [];
    half.forEach(function (label) {
      var textGroup = self._drawLabel(label);

      var labelGroup = self.labelGroup;
      labelGroup.add(textGroup);

      self._drawLabelLine(label, maxLabelWidth);

      drawnLabels.push(textGroup);
    });
    return drawnLabels;
  }

  _getSelectedShapeByData(data) {
    var selectedShape = null;
    var chart = this.chart;
    var geom = chart.get('geoms')[0];
    var container = geom.get('container');
    var children = container.get('children');
    each(children, function (child) {
      if (child.get('isShape') && child.get('className') === geom.get('type')) {
        // get geometry's shape
        var shapeData = child.get('origin')._origin;

        if (isObjectValueEqual(shapeData, data)) {
          selectedShape = child;
          return false;
        }
      }
    });
    return selectedShape;
  }

  _activeShape(data) {
    var {
      chart,
      lastSelectedData,
      pieLabelCfg
    } = this;

    if (data === lastSelectedData) {
      return;
    }

    this.lastSelectedData = data;
    var activeStyle = pieLabelCfg.activeStyle;

    var selectedShape = this._getSelectedShapeByData(data);

    var {
      x,
      y,
      startAngle,
      endAngle,
      r,
      fill
    } = selectedShape._attrs.attrs;
    var frontPlot = chart.get('frontPlot');
    this.halo && this.halo.remove(true);
    var halo = frontPlot.addShape('sector', {
      attrs: mix({
        x,
        y,
        r: r + activeStyle.offset + activeStyle.appendRadius,
        r0: r + activeStyle.offset,
        fill,
        startAngle,
        endAngle
      }, activeStyle)
    });
    this.halo = halo;
    chart.get('canvas').draw();
  }

}

function init(chart) {
  var frontPlot = chart.get('frontPlot');
  var labelGroup = frontPlot.addGroup({
    className: 'pie-label',
    zIndex: 0
  });
  var pieLabelController = new controller({
    chart,
    labelGroup
  });
  chart.set('pieLabelController', pieLabelController);

  chart.pieLabel = function (cfg) {
    cfg = deepMix({}, DEFAULT_CFG, cfg);
    pieLabelController.pieLabelCfg = cfg;
    return this;
  };
}

function afterGeomDraw(chart) {
  var controller = chart.get('pieLabelController');

  if (controller.pieLabelCfg) {
    // 用户配置了饼图文本
    controller.renderLabels();
    controller.bindEvents(); // 绑定事件
  }
}

function clearInner(chart) {
  var controller = chart.get('pieLabelController');

  if (controller.pieLabelCfg) {
    // 用户配置了饼图文本
    controller.clear();
  }
}

export { init, afterGeomDraw, clearInner };
export default {
  init,
  afterGeomDraw,
  clearInner
};