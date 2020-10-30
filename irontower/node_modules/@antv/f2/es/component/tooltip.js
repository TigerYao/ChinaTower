import { deepMix, mix, isFunction, directionEnabled, parsePadding } from '../util/common';
import Marker from './marker';
import Container from './list';
import TextBox from './text-box';
var GAP = 4;
/**
 * TODOList：
 * 1. 移除 fixed 参数
 */

class Tooltip {
  getDefaultCfg() {
    return {
      /**
       * wether show the crosshairs
       * @type {Object}
       */
      showCrosshairs: false,

      /**
       * the style for crosshairs
       * @type {Object}
       */
      crosshairsStyle: {
        stroke: 'rgba(0, 0, 0, 0.25)',
        lineWidth: 1
      },

      /**
       * the type of crosshairs, optional value is 'x', 'y' or 'xy', default is 'y'
       */
      crosshairsType: 'y',

      /**
       * show or hide the x axis tip
       */
      showXTip: false,

      /**
       * show or hide the y axis tip
       */
      showYTip: false,
      xTip: null,
      xTipBackground: {
        radius: 1,
        fill: 'rgba(0, 0, 0, 0.65)',
        padding: [3, 5]
      },
      xTipTextStyle: {
        fontSize: 12,
        fill: '#fff',
        textAlign: 'center',
        textBaseline: 'middle'
      },
      yTip: null,
      yTipBackground: {
        radius: 1,
        fill: 'rgba(0, 0, 0, 0.65)',
        padding: [3, 5]
      },
      yTipTextStyle: {
        fontSize: 12,
        fill: '#fff',
        textAlign: 'center',
        textBaseline: 'middle'
      },

      /**
       * the style for tooltip container's background
       * @type {Object}
       */
      background: null,

      /**
       * layout, can be horizontal or vertical
       * @type {String}
       */
      layout: 'horizontal',
      offsetX: 0,
      offsetY: 0
    };
  }

  constructor(cfg) {
    deepMix(this, this.getDefaultCfg(), cfg);
    var {
      frontPlot,
      custom
    } = this;

    if (!custom) {
      // custom means user do customize
      var container = new Container(mix({
        parent: frontPlot,
        zIndex: 3
      }, cfg));
      this.container = container;
      var {
        fixed,
        background
      } = this;

      if (!fixed) {
        this.tooltipArrow = frontPlot.addShape('Polygon', {
          className: 'tooltip-arrow',
          visible: false,
          zIndex: 2,
          attrs: mix({
            points: []
          }, background)
        });
      }
    }

    if (this.showXTip) {
      var {
        xTipBackground,
        xTipTextStyle
      } = this;
      var xTipBox = new TextBox({
        context: frontPlot.get('context'),
        className: 'xTip',
        background: xTipBackground,
        textStyle: xTipTextStyle,
        visible: false
      });
      frontPlot.add(xTipBox.container);
      this.xTipBox = xTipBox;
    }

    if (this.showYTip) {
      var {
        yTipBackground,
        yTipTextStyle
      } = this;
      var yTipBox = new TextBox({
        context: frontPlot.get('context'),
        className: 'yTip',
        background: yTipBackground,
        textStyle: yTipTextStyle,
        visible: false
      });
      frontPlot.add(yTipBox.container);
      this.yTipBox = yTipBox;
    }

    if (this.showCrosshairs) {
      this._renderCrosshairs();
    }

    frontPlot.sort();
  }

  setContent(title, items) {
    this.title = title;
    this.items = items;

    if (!this.custom) {
      var container = this.container;
      container.setTitle(title);
      container.setItems(items);
    }
  }

  setYTipContent(val) {
    var yTip = this.yTip;

    if (isFunction(yTip)) {
      val = yTip(val);
    } else {
      val = mix({
        text: val
      }, yTip);
    }

    this.yTipBox && this.yTipBox.updateContent(val);
  }

  setYTipPosition(pos) {
    var plotRange = this.plotRange;
    var crosshairsShapeX = this.crosshairsShapeX;

    if (this.showYTip) {
      var yTipBox = this.yTipBox;
      var yTipHeight = yTipBox.getHeight();
      var yTipWidth = yTipBox.getWidth();
      var posX = plotRange.tl.x - yTipWidth;
      var posY = pos - yTipHeight / 2;

      if (posY <= plotRange.tl.y) {
        posY = plotRange.tl.y;
      }

      if (posY + yTipHeight >= plotRange.br.y) {
        posY = plotRange.br.y - yTipHeight;
      }

      if (posX < 0) {
        posX = plotRange.tl.x;
        crosshairsShapeX && crosshairsShapeX.attr('x1', plotRange.tl.x + yTipWidth);
      }

      yTipBox.updatePosition(posX, posY);
    }
  }

  setXTipContent(val) {
    var xTip = this.xTip;

    if (isFunction(xTip)) {
      val = xTip(val);
    } else {
      val = mix({
        text: val
      }, xTip);
    }

    this.xTipBox && this.xTipBox.updateContent(val);
  }

  setXTipPosition(pos) {
    var {
      showXTip,
      canvas,
      plotRange,
      xTipBox,
      crosshairsShapeY
    } = this;

    if (showXTip) {
      // const el = canvas.get('el');
      // const canvasHeight = Util.getHeight(el);
      var canvasHeight = canvas.get('height');
      var xTipWidth = xTipBox.getWidth();
      var xTipHeight = xTipBox.getHeight();
      var posX = pos - xTipWidth / 2;
      var posY = plotRange.br.y;

      if (posX <= plotRange.tl.x) {
        posX = plotRange.tl.x;
      }

      if (posX + xTipWidth >= plotRange.tr.x) {
        posX = plotRange.tr.x - xTipWidth;
      }

      if (canvasHeight - posY < xTipHeight) {
        posY -= xTipHeight;
      }

      xTipBox.updatePosition(posX, posY);
      crosshairsShapeY && crosshairsShapeY.attr('y1', posY);
    }
  }

  setXCrosshairPosition(pos) {
    this.crosshairsShapeX && this.crosshairsShapeX.moveTo(0, pos);
  }

  setYCrosshairPosition(pos) {
    this.crosshairsShapeY && this.crosshairsShapeY.moveTo(pos, 0);
  }

  setPosition(items) {
    var {
      container,
      plotRange,
      offsetX,
      offsetY,
      fixed,
      tooltipArrow
    } = this;

    if (!container) {
      return;
    }

    var containerBBox = container.container.getBBox();
    var {
      minX,
      minY,
      width,
      height
    } = containerBBox;
    var {
      tl,
      tr
    } = plotRange;
    var posX = 0;
    var posY = tl.y - height - GAP + offsetY;

    if (fixed) {
      var x = (tl.x + tr.x) / 2;
      posX = x - width / 2 + offsetX;
    } else {
      var _x;

      if (items.length > 1) {
        _x = (items[0].x + items[items.length - 1].x) / 2;
      } else {
        _x = items[0].x;
      }

      posX = _x - width / 2 + offsetX;

      if (posX < tl.x) {
        posX = tl.x;
      }

      if (posX + width > tr.x) {
        posX = tr.x - width;
      }

      if (tooltipArrow) {
        tooltipArrow.attr('points', [{
          x: _x - 3,
          y: tl.y - GAP + offsetY
        }, {
          x: _x + 3,
          y: tl.y - GAP + offsetY
        }, {
          x: _x,
          y: tl.y + offsetY
        }]);
        var backShape = container.backShape;
        var radius = parsePadding(backShape.attr('radius'));

        if (_x === tl.x) {
          radius[3] = 0;
          tooltipArrow.attr('points', [{
            x: tl.x,
            y: tl.y + offsetY
          }, {
            x: tl.x,
            y: tl.y - GAP + offsetY
          }, {
            x: tl.x + GAP,
            y: tl.y - GAP + offsetY
          }]);
        } else if (_x === tr.x) {
          radius[2] = 0;
          tooltipArrow.attr('points', [{
            x: tr.x,
            y: tl.y + offsetY
          }, {
            x: tr.x - GAP,
            y: tl.y - GAP + offsetY
          }, {
            x: tr.x,
            y: tl.y - GAP + offsetY
          }]);
        }

        backShape.attr('radius', radius);
      }
    }

    container.moveTo(posX - minX, posY - minY);
  }

  setMarkers() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var self = this;
    var {
      items,
      style,
      type
    } = cfg;

    var markerGroup = self._getMarkerGroup(type);

    if (type === 'circle') {
      for (var i = 0, length = items.length; i < length; i++) {
        var item = items[i];
        var marker = new Marker({
          className: 'tooltip-circle-marker',
          attrs: mix({
            x: item.x,
            y: item.y,
            stroke: item.color
          }, style)
        });
        markerGroup.add(marker);
      }
    } else {
      markerGroup.addShape('rect', {
        className: 'tooltip-rect-marker',
        attrs: style
      });
    }
  }

  clearMarkers() {
    var markerGroup = this.markerGroup;
    markerGroup && markerGroup.clear();
  }

  show() {
    var crosshairsShapeX = this.crosshairsShapeX;
    var crosshairsShapeY = this.crosshairsShapeY;
    var markerGroup = this.markerGroup;
    var container = this.container;
    var tooltipArrow = this.tooltipArrow;
    var xTipBox = this.xTipBox;
    var yTipBox = this.yTipBox;
    var canvas = this.canvas;
    crosshairsShapeX && crosshairsShapeX.show();
    crosshairsShapeY && crosshairsShapeY.show();
    markerGroup && markerGroup.show();
    container && container.show();
    tooltipArrow && tooltipArrow.show();
    xTipBox && xTipBox.show();
    yTipBox && yTipBox.show();
    canvas.draw();
  }

  hide() {
    var crosshairsShapeX = this.crosshairsShapeX;
    var crosshairsShapeY = this.crosshairsShapeY;
    var markerGroup = this.markerGroup;
    var container = this.container;
    var tooltipArrow = this.tooltipArrow;
    var xTipBox = this.xTipBox;
    var yTipBox = this.yTipBox;
    crosshairsShapeX && crosshairsShapeX.hide();
    crosshairsShapeY && crosshairsShapeY.hide();
    markerGroup && markerGroup.hide();
    container && container.hide();
    tooltipArrow && tooltipArrow.hide();
    xTipBox && xTipBox.hide();
    yTipBox && yTipBox.hide();
  }

  destroy() {
    var crosshairsShapeX = this.crosshairsShapeX;
    var crosshairsShapeY = this.crosshairsShapeY;
    var markerGroup = this.markerGroup;
    var container = this.container;
    var tooltipArrow = this.tooltipArrow;
    var xTipBox = this.xTipBox;
    var yTipBox = this.yTipBox;
    crosshairsShapeX && crosshairsShapeX.remove(true);
    crosshairsShapeY && crosshairsShapeY.remove(true);
    markerGroup && markerGroup.remove(true);
    tooltipArrow && tooltipArrow.remove(true);
    container && container.clear();
    xTipBox && xTipBox.clear();
    yTipBox && yTipBox.clear();
    this.destroyed = true;
  }

  _getMarkerGroup(type) {
    var markerGroup = this.markerGroup;

    if (!markerGroup) {
      if (type === 'circle') {
        markerGroup = this.frontPlot.addGroup({
          zIndex: 1
        });
        this.frontPlot.sort();
      } else {
        markerGroup = this.backPlot.addGroup();
      }

      this.markerGroup = markerGroup;
    } else {
      markerGroup.clear();
    }

    return markerGroup;
  }

  _renderCrosshairs() {
    var {
      crosshairsType,
      crosshairsStyle,
      frontPlot,
      plotRange
    } = this;
    var {
      tl,
      br
    } = plotRange;

    if (directionEnabled(crosshairsType, 'x')) {
      this.crosshairsShapeX = frontPlot.addShape('Line', {
        className: 'tooltip-crosshairs-x',
        zIndex: 0,
        visible: false,
        attrs: mix({
          x1: tl.x,
          y1: 0,
          x2: br.x,
          y2: 0
        }, crosshairsStyle)
      });
    }

    if (directionEnabled(crosshairsType, 'y')) {
      this.crosshairsShapeY = frontPlot.addShape('Line', {
        className: 'tooltip-crosshairs-y',
        zIndex: 0,
        visible: false,
        attrs: mix({
          x1: 0,
          y1: br.y,
          x2: 0,
          y2: tl.y
        }, crosshairsStyle)
      });
    }
  }

}

export default Tooltip;