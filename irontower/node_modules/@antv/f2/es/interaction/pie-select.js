import { mix, each, isWx, isMy, isObject, isObjectValueEqual, createEvent } from '../util/common';
import Interaction from './base';
import Chart from '../chart/chart';

class PieSelect extends Interaction {
  getDefaultCfg() {
    var defaultCfg = super.getDefaultCfg();
    defaultCfg = mix({}, defaultCfg, {
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

    if (isWx || isMy) {
      // 小程序
      defaultCfg.startEvent = 'touchstart';
      defaultCfg.endEvent = 'touchend';
    }

    return defaultCfg;
  }

  constructor(cfg, chart) {
    super(cfg, chart);
    var self = this;
    chart.registerPlugins({
      clearInner() {
        self.halo && self.halo.remove(true);
        self.selected = false;
        self.selectedShape = null;
        self.lastShape = null;
        self.halo = null;
        self.defaultSelected = null;
      }

    });
    var defaultSelected = self.defaultSelected;

    if (isObject(defaultSelected)) {
      var selectedShape = self._getSelectedShapeByData(defaultSelected);

      selectedShape && self._selectedShape(selectedShape);
      this.canvas.draw();
    }
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

  _selectedShape(selectedShape) {
    var {
      offset,
      style,
      appendRadius,
      chart
    } = this;
    this.lastShape = selectedShape;
    var {
      x,
      y,
      startAngle,
      endAngle,
      r,
      fill
    } = selectedShape._attrs.attrs;
    var frontPlot = chart.get('frontPlot');
    var halo = frontPlot.addShape('sector', {
      attrs: mix({
        x,
        y,
        r: r + offset + appendRadius,
        r0: r + offset,
        fill,
        startAngle,
        endAngle
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
      halo.animate().to(mix({
        attrs: {
          r: r + offset + appendRadius
        }
      }, animate));
    }
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
    var records = chart.getSnapRecords({
      x,
      y
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
  }

  end(ev) {
    var selectedShape = this.selectedShape;

    if (selectedShape && !selectedShape.get('destroyed')) {
      ev.data = selectedShape.get('origin')._origin;
      ev.shapeInfo = selectedShape.get('origin');
      ev.shape = selectedShape;
      ev.selected = !!this.selected;
    }
  }

}

Chart.registerInteraction('pie-select', PieSelect);
export default PieSelect;