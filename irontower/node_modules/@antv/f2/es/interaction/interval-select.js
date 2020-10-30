import { mix, each, isWx, isMy, isObject, isObjectValueEqual, createEvent } from '../util/common';
import { isPointInPlot } from '../util/helper';
import Interaction from './base';
import Chart from '../chart/chart';

class IntervalSelect extends Interaction {
  getDefaultCfg() {
    var defaultCfg = super.getDefaultCfg();
    defaultCfg = mix({}, defaultCfg, {
      startEvent: 'tap',
      processEvent: null,
      selectAxis: true,
      selectAxisStyle: {
        fontWeight: 'bold'
      },
      mode: 'shape',
      selectStyle: {
        fillOpacity: 1
      },
      unSelectStyle: {
        fillOpacity: 0.4
      },
      cancelable: true,
      defaultSelected: null // set the default selected shape

    });

    if (isWx || isMy) {
      // 小程序
      defaultCfg.startEvent = 'touchstart';
      defaultCfg.endEvent = 'touchend';
    }

    return defaultCfg;
  }

  constructor(cfg, chart) {
    super(cfg, chart);
    var defaultSelected = this.defaultSelected;

    if (isObject(defaultSelected)) {
      var {
        selectedShape,
        unSelectedShapes
      } = this._selectShapesByData(defaultSelected);

      selectedShape && this._selectShapes(selectedShape, unSelectedShapes);
      this.selectedShape = selectedShape;
    }
  }

  _getIntervalShapes() {
    var children = [];
    var chart = this.chart;
    var geoms = chart.get('geoms');
    geoms.forEach(function (geom) {
      if (geom.get('type') === 'interval') {
        // only works for Interval geometry type
        var container = geom.get('container');
        children = children.concat(container.get('children'));
      }
    });
    return children;
  }

  _resetShape(shape) {
    var originAttrs = shape.get('_originAttrs');

    if (originAttrs) {
      shape._attrs.attrs = originAttrs;
      shape.set('_originAttrs', null);
    }
  }

  _setEventData(ev) {
    var selectedShape = this.selectedShape;

    if (selectedShape && !selectedShape.get('destroyed')) {
      ev.data = selectedShape.get('origin')._origin;
      ev.shapeInfo = selectedShape.get('origin');
      ev.shape = selectedShape;
      ev.selected = !!selectedShape.get('_selected');
    }
  }

  _selectShapesByData(data) {
    var children = this._getIntervalShapes();

    var selectedShape = null;
    var unSelectedShapes = [];
    each(children, function (child) {
      if (child.get('isShape') && child.get('className') === 'interval') {
        // get geometry's shape
        var shapeData = child.get('origin')._origin;

        if (isObjectValueEqual(shapeData, data)) {
          selectedShape = child;
        } else {
          unSelectedShapes.push(child);
        }
      }
    });
    return {
      selectedShape,
      unSelectedShapes
    };
  }

  _selectShapes(selectedShape, unSelectedShapes) {
    var {
      selectStyle,
      unSelectStyle,
      selectAxisStyle,
      chart
    } = this;

    if (!selectedShape.get('_originAttrs')) {
      var originAttrs = Object.assign({}, selectedShape.attr());
      selectedShape.set('_originAttrs', originAttrs);
    }

    selectedShape.attr(selectStyle);
    each(unSelectedShapes, function (child) {
      if (!child.get('_originAttrs')) {
        var _originAttrs = Object.assign({}, child.attr());

        child.set('_originAttrs', _originAttrs);
      } else {
        child.attr(child.get('_originAttrs'));
      }

      child.set('_selected', false);
      unSelectStyle && child.attr(unSelectStyle);
    });
    selectedShape.set('_selected', true);

    if (this.selectAxis) {
      if (this.selectedAxisShape) {
        this._resetShape(this.selectedAxisShape);
      }

      var xScale = chart.getXScale();

      var origin = selectedShape.get('origin')._origin;

      var {
        frontPlot,
        backPlot
      } = chart.get('axisController');
      var axisShape;
      each(frontPlot.get('children').concat(backPlot.get('children')), function (s) {
        if (s.get('value') === xScale.scale(origin[xScale.field])) {
          axisShape = s;
          return false;
        }
      });
      this.selectedAxisShape = axisShape;
      axisShape.set('_originAttrs', Object.assign({}, axisShape.attr()));
      axisShape.attr(selectAxisStyle);
    }

    this.canvas.draw();
  }

  reset() {
    var self = this;

    if (!self.selectedShape) {
      return;
    }

    var children = self._getIntervalShapes();

    each(children, function (child) {
      self._resetShape(child);

      child.set('_selected', false);
    });

    if (self.selectedAxisShape) {
      self._resetShape(self.selectedAxisShape);
    }

    self.canvas.draw();
    self.selectedShape = null;
    self.selectedAxisShape = null;
  }

  start(ev) {
    var chart = this.chart;

    if (ev.type === 'tap') {
      ev.clientX = ev.center.x;
      ev.clientY = ev.center.y;
    }

    var {
      x,
      y
    } = createEvent(ev, chart);
    var mode = this.mode;

    var children = this._getIntervalShapes();

    var selectedShape;
    var unSelectedShapes = [];

    if (mode === 'shape') {
      var plot = chart.get('plotRange');

      if (!isPointInPlot({
        x,
        y
      }, plot)) {
        this.reset();
        return;
      }

      each(children, function (child) {
        var box = child.getBBox();

        if (x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.height + box.y) {
          // inbox
          selectedShape = child;
        } else {
          unSelectedShapes.push(child);
        }
      });
    } else if (mode === 'range') {
      var records = chart.getSnapRecords({
        x,
        y
      });

      if (!records.length) {
        this.reset();
        return;
      }

      var data = records[0]._origin;

      var result = this._selectShapesByData(data);

      selectedShape = result.selectedShape;
      unSelectedShapes = result.unSelectedShapes;
    }

    if (selectedShape) {
      this.selectedShape = selectedShape;

      if (selectedShape.get('_selected')) {
        if (!this.cancelable) {
          this._setEventData(ev);

          return;
        }

        this.reset();
      } else {
        this._selectShapes(selectedShape, unSelectedShapes);
      }
    } else {
      this.reset();
    }

    this._setEventData(ev);
  }

  end(ev) {
    this._setEventData(ev);
  }

}

Chart.registerInteraction('interval-select', IntervalSelect);
export default IntervalSelect;