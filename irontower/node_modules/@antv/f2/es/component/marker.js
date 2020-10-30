/**
 * marker shapes，used for tooltip and legend
 */
import { isFunction } from '../util/common';
import { Shape } from '../graphic/index';
var SYMBOLS = {
  circle(x, y, r, ctx) {
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
  },

  square(x, y, r, ctx) {
    ctx.moveTo(x - r, y - r);
    ctx.lineTo(x + r, y - r);
    ctx.lineTo(x + r, y + r);
    ctx.lineTo(x - r, y + r);
    ctx.closePath();
  }

};

class Marker extends Shape {
  _initProperties() {
    super._initProperties();

    this._attrs.canFill = true;
    this._attrs.canStroke = true;
    this._attrs.type = 'marker';
  }

  getDefaultAttrs() {
    return {
      x: 0,
      y: 0,
      lineWidth: 0
    };
  }

  createPath(context) {
    var attrs = this.get('attrs');
    var {
      x,
      y,
      radius
    } = attrs;
    var symbol = attrs.symbol || 'circle';
    var method;

    if (isFunction(symbol)) {
      method = symbol;
    } else {
      method = SYMBOLS[symbol];
    }

    context.beginPath();
    method(x, y, radius, context, this);
  }

  calculateBox() {
    var attrs = this.get('attrs');
    var {
      x,
      y,
      radius
    } = attrs;
    return {
      minX: x - radius,
      minY: y - radius,
      maxX: x + radius,
      maxY: y + radius
    };
  }

}

export default Marker;