import { mix, isObject, isArray, Array } from '../util/common';
import MatrixUtil from './util/matrix';
import Vector2 from './util/vector2';
import { parseStyle } from './util/style-parse';
var ALIAS_ATTRS_MAP = {
  stroke: 'strokeStyle',
  fill: 'fillStyle',
  opacity: 'globalAlpha'
};
var SHAPE_ATTRS = ['fillStyle', 'font', 'globalAlpha', 'lineCap', 'lineWidth', 'lineJoin', 'miterLimit', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'strokeStyle', 'textAlign', 'textBaseline', 'lineDash', 'shadow' // 兼容支付宝小程序
];
var CLIP_SHAPES = ['circle', 'sector', 'polygon', 'rect', 'polyline'];

class Element {
  _initProperties() {
    this._attrs = {
      zIndex: 0,
      visible: true,
      destroyed: false
    };
  }

  constructor(cfg) {
    this._initProperties();

    mix(this._attrs, cfg);
    var attrs = this._attrs.attrs;

    if (attrs) {
      this.initAttrs(attrs);
    }

    this.initTransform();
  }

  get(name) {
    return this._attrs[name];
  }

  set(name, value) {
    this._attrs[name] = value;
  }

  isGroup() {
    return this.get('isGroup');
  }

  isShape() {
    return this.get('isShape');
  }

  initAttrs(attrs) {
    this.attr(mix(this.getDefaultAttrs(), attrs));
  }

  getDefaultAttrs() {
    return {};
  }

  _setAttr(name, value) {
    var attrs = this._attrs.attrs;

    if (name === 'clip') {
      value = this._setAttrClip(value);
    } else {
      var alias = ALIAS_ATTRS_MAP[name];

      if (alias) {
        attrs[alias] = value;
      }
    }

    attrs[name] = value;
  }

  _getAttr(name) {
    return this._attrs.attrs[name];
  } // _afterAttrsSet() {}


  _setAttrClip(clip) {
    if (clip && CLIP_SHAPES.indexOf(clip._attrs.type) > -1) {
      if (clip.get('canvas') === null) {
        clip = Object.assign({}, clip);
      }

      clip.set('parent', this.get('parent'));
      clip.set('context', this.get('context'));
      return clip;
    }

    return null;
  }

  attr(name, value) {
    var self = this;
    if (self.get('destroyed')) return null;
    var argumentsLen = arguments.length;

    if (argumentsLen === 0) {
      return self._attrs.attrs;
    }

    if (isObject(name)) {
      this._attrs.bbox = null;

      for (var k in name) {
        self._setAttr(k, name[k]);
      }

      if (self._afterAttrsSet) {
        self._afterAttrsSet();
      }

      return self;
    }

    if (argumentsLen === 2) {
      this._attrs.bbox = null;

      self._setAttr(name, value);

      if (self._afterAttrsSet) {
        self._afterAttrsSet();
      }

      return self;
    }

    return self._getAttr(name);
  }

  getParent() {
    return this.get('parent');
  }

  draw(context) {
    if (this.get('destroyed')) {
      return;
    }

    if (this.get('visible')) {
      this.setContext(context);
      this.drawInner(context);
      this.restoreContext(context);
    }
  }

  setContext(context) {
    var clip = this._attrs.attrs.clip;
    context.save();

    if (clip) {
      clip.resetTransform(context);
      clip.createPath(context);
      context.clip();
    }

    this.resetContext(context);
    this.resetTransform(context);
  }

  restoreContext(context) {
    context.restore();
  }

  resetContext(context) {
    var elAttrs = this._attrs.attrs;

    if (!this._attrs.isGroup) {
      for (var k in elAttrs) {
        if (SHAPE_ATTRS.indexOf(k) > -1) {
          var v = elAttrs[k];

          if (k === 'fillStyle' || k === 'strokeStyle') {
            v = parseStyle(v, this, context);
          }

          if (k === 'lineDash' && context.setLineDash && isArray(v)) {
            context.setLineDash(v);
          } else {
            context[k] = v;
          }
        }
      }
    }
  }

  hasFill() {
    return this.get('canFill') && this._attrs.attrs.fillStyle;
  }

  hasStroke() {
    return this.get('canStroke') && this._attrs.attrs.strokeStyle;
  }

  drawInner()
  /* context */
  {}

  show() {
    this.set('visible', true);
    return this;
  }

  hide() {
    this.set('visible', false);
    return this;
  }

  isVisible() {
    return this.get('visible');
  }

  _removeFromParent() {
    var parent = this.get('parent');

    if (parent) {
      var children = parent.get('children');
      Array.remove(children, this);
    }

    return this;
  }

  remove(destroy) {
    if (destroy) {
      this.destroy();
    } else {
      this._removeFromParent();
    }
  }

  destroy() {
    var destroyed = this.get('destroyed');

    if (destroyed) {
      return null;
    }

    this._removeFromParent();

    this._attrs = {};
    this.set('destroyed', true);
  }

  getBBox() {
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
      width: 0,
      height: 0
    };
  }

  initTransform() {
    var attrs = this._attrs.attrs || {};

    if (!attrs.matrix) {
      attrs.matrix = [1, 0, 0, 1, 0, 0];
    }

    this._attrs.attrs = attrs;
  }

  getMatrix() {
    return this._attrs.attrs.matrix;
  }

  setMatrix(m) {
    this._attrs.attrs.matrix = [m[0], m[1], m[2], m[3], m[4], m[5]];
  }

  transform(actions) {
    var matrix = this._attrs.attrs.matrix;
    this._attrs.attrs.matrix = MatrixUtil.transform(matrix, actions);
    return this;
  }

  setTransform(actions) {
    this._attrs.attrs.matrix = [1, 0, 0, 1, 0, 0];
    return this.transform(actions);
  }

  translate(x, y) {
    var matrix = this._attrs.attrs.matrix;
    MatrixUtil.translate(matrix, matrix, [x, y]);
  }

  rotate(rad) {
    var matrix = this._attrs.attrs.matrix;
    MatrixUtil.rotate(matrix, matrix, rad);
  }

  scale(sx, sy) {
    var matrix = this._attrs.attrs.matrix;
    MatrixUtil.scale(matrix, matrix, [sx, sy]);
  }

  moveTo(x, y) {
    var cx = this._attrs.x || 0;
    var cy = this._attrs.y || 0;
    this.translate(x - cx, y - cy);
    this.set('x', x);
    this.set('y', y);
  }

  apply(v) {
    var m = this._attrs.attrs.matrix;
    Vector2.transformMat2d(v, v, m);
    return this;
  }

  resetTransform(context) {
    var mo = this._attrs.attrs.matrix;

    if (MatrixUtil.isChanged(mo)) {
      context.transform(mo[0], mo[1], mo[2], mo[3], mo[4], mo[5]);
    }
  }

  isDestroyed() {
    return this.get('destroyed');
  }

}

export default Element;