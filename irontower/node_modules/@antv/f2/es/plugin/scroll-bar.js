import { getFieldRange, getLimitRange } from '../interaction/helper';
import { isObject, deepMix, directionEnabled } from '../util/common';
var DEFAULT_CFG = {
  mode: 'x',
  xStyle: {
    backgroundColor: 'rgba(202, 215, 239, .2)',
    fillerColor: 'rgba(202, 215, 239, .5)',
    size: 4,
    lineCap: 'round',
    offsetX: 0,
    offsetY: 8
  },
  yStyle: {
    backgroundColor: 'rgba(202, 215, 239, .2)',
    fillerColor: 'rgba(202, 215, 239, .5)',
    size: 4,
    lineCap: 'round',
    offsetX: 8,
    offsetY: 0
  }
};

function init(chart) {
  chart.set('_limitRange', {});

  chart.scrollBar = function (cfg) {
    if (cfg === true) {
      cfg = DEFAULT_CFG;
    } else if (isObject(cfg)) {
      cfg = deepMix({}, DEFAULT_CFG, cfg);
    }

    this.set('_scrollBarCfg', cfg);
  };
}

function clear(chart) {
  chart.set('_limitRange', {});
}

function changeData(chart) {
  chart.set('_limitRange', {});
}

function clearInner(chart) {
  var hBar = chart.get('_horizontalBar');
  var vBar = chart.get('_verticalBar');
  hBar && hBar.remove(true);
  vBar && vBar.remove(true);
  chart.set('_horizontalBar', null);
  chart.set('_verticalBar', null);
}

function afterGeomDraw(chart) {
  var scrollBarCfg = chart.get('_scrollBarCfg');
  if (!scrollBarCfg) return;
  var data = chart.get('data');
  var plotRange = chart.get('plotRange');
  var backPlot = chart.get('backPlot');
  var canvas = chart.get('canvas');
  var canvasHeight = canvas.get('height');
  var limitRange = chart.get('_limitRange');
  var mode = scrollBarCfg.mode;

  if (directionEnabled(mode, 'x')) {
    var {
      offsetX,
      offsetY,
      lineCap,
      backgroundColor,
      fillerColor,
      size
    } = scrollBarCfg.xStyle;
    var xScale = chart.getXScale();
    var xLimitRange = limitRange[xScale.field];

    if (!xLimitRange) {
      xLimitRange = getLimitRange(data, xScale);
      limitRange[xScale.field] = xLimitRange;
    }

    var currentRange = getFieldRange(xScale, xLimitRange, xScale.type);
    var horizontalBar = chart.get('_horizontalBar');
    var yPos = canvasHeight - size / 2 + offsetY;

    if (horizontalBar) {
      var progressLine = horizontalBar.get('children')[1];
      progressLine.attr({
        x1: Math.max(plotRange.bl.x + plotRange.width * currentRange[0] + offsetX, plotRange.bl.x),
        x2: Math.min(plotRange.bl.x + plotRange.width * currentRange[1] + offsetX, plotRange.br.x)
      });
    } else {
      horizontalBar = backPlot.addGroup({
        className: 'horizontalBar'
      });
      horizontalBar.addShape('line', {
        attrs: {
          x1: plotRange.bl.x + offsetX,
          y1: yPos,
          x2: plotRange.br.x + offsetX,
          y2: yPos,
          lineWidth: size,
          stroke: backgroundColor,
          lineCap
        }
      });
      horizontalBar.addShape('line', {
        attrs: {
          x1: Math.max(plotRange.bl.x + plotRange.width * currentRange[0] + offsetX, plotRange.bl.x),
          y1: yPos,
          x2: Math.min(plotRange.bl.x + plotRange.width * currentRange[1] + offsetX, plotRange.br.x),
          y2: yPos,
          lineWidth: size,
          stroke: fillerColor,
          lineCap
        }
      });
      chart.set('_horizontalBar', horizontalBar);
    }
  }

  if (directionEnabled(mode, 'y')) {
    var {
      offsetX: _offsetX,
      offsetY: _offsetY,
      lineCap: _lineCap,
      backgroundColor: _backgroundColor,
      fillerColor: _fillerColor,
      size: _size
    } = scrollBarCfg.yStyle;
    var yScale = chart.getYScales()[0];
    var yLimitRange = limitRange[yScale.field];

    if (!yLimitRange) {
      yLimitRange = getLimitRange(data, yScale);
      limitRange[yScale.field] = yLimitRange;
    }

    var _currentRange = getFieldRange(yScale, yLimitRange, yScale.type);

    var verticalBar = chart.get('_verticalBar');
    var xPos = _size / 2 + _offsetX;

    if (verticalBar) {
      var _progressLine = verticalBar.get('children')[1];

      _progressLine.attr({
        y1: Math.max(plotRange.tl.y + plotRange.height * _currentRange[0] + _offsetY, plotRange.tl.y),
        y2: Math.min(plotRange.tl.y + plotRange.height * _currentRange[1] + _offsetY, plotRange.bl.y)
      });
    } else {
      verticalBar = backPlot.addGroup({
        className: 'verticalBar'
      });
      verticalBar.addShape('line', {
        attrs: {
          x1: xPos,
          y1: plotRange.tl.y + _offsetY,
          x2: xPos,
          y2: plotRange.bl.y + _offsetY,
          lineWidth: _size,
          stroke: _backgroundColor,
          lineCap: _lineCap
        }
      });
      verticalBar.addShape('line', {
        attrs: {
          x1: xPos,
          y1: Math.max(plotRange.tl.y + plotRange.height * _currentRange[0] + _offsetY, plotRange.tl.y),
          x2: xPos,
          y2: Math.min(plotRange.tl.y + plotRange.height * _currentRange[1] + _offsetY, plotRange.bl.y),
          lineWidth: _size,
          stroke: _fillerColor,
          lineCap: _lineCap
        }
      });
      chart.set('_verticalBar', verticalBar);
    }
  }
}

export { init, clear, changeData, clearInner, afterGeomDraw };
export default {
  init,
  clear,
  changeData,
  clearInner,
  afterGeomDraw
};