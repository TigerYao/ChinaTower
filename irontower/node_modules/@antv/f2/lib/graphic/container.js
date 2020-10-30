"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../util/common");

var _shape = _interopRequireDefault(require("./shape"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SHAPE_MAP = {};
var INDEX = '_INDEX';

function getComparer(compare) {
  return function (left, right) {
    var result = compare(left, right);
    return result === 0 ? left[INDEX] - right[INDEX] : result;
  };
}

var _default = {
  getGroupClass: function getGroupClass() {},
  getChildren: function getChildren() {
    return this.get('children');
  },
  addShape: function addShape(type, cfg) {
    if (cfg === void 0) {
      cfg = {};
    }

    var canvas = this.get('canvas');
    var shapeType = SHAPE_MAP[type];

    if (!shapeType) {
      shapeType = (0, _common.upperFirst)(type);
      SHAPE_MAP[type] = shapeType;
    }

    cfg.canvas = canvas;

    if (shapeType === 'Text' && canvas && canvas.get('fontFamily')) {
      cfg.attrs.fontFamily = cfg.attrs.fontFamily || canvas.get('fontFamily');
    }

    var shape = new _shape["default"][shapeType](cfg);
    this.add(shape);
    return shape;
  },
  addGroup: function addGroup(cfg) {
    var canvas = this.get('canvas');
    var groupClass = this.getGroupClass();
    cfg = (0, _common.mix)({}, cfg);
    cfg.canvas = canvas;
    cfg.parent = this;
    var rst = new groupClass(cfg);
    this.add(rst);
    return rst;
  },
  contain: function contain(item) {
    var children = this.get('children');
    return children.indexOf(item) > -1;
  },
  sort: function sort() {
    var children = this.get('children');

    for (var i = 0, len = children.length; i < len; i++) {
      var child = children[i];
      child[INDEX] = i;
    }

    children.sort(getComparer(function (obj1, obj2) {
      return obj1.get('zIndex') - obj2.get('zIndex');
    }));
    return this;
  },
  drawInner: function drawInner(context) {
    var children = this.get('children');

    for (var i = 0, len = children.length; i < len; i++) {
      var child = children[i];
      child.draw(context);
    }

    return this;
  },
  clear: function clear() {
    var children = this.get('children');

    while (children.length !== 0) {
      children[children.length - 1].remove(true);
    }

    return this;
  },
  add: function add(items) {
    var self = this;
    var children = self.get('children');

    if (!(0, _common.isArray)(items)) {
      items = [items];
    }

    for (var i = 0, len = items.length; i < len; i++) {
      var item = items[i];
      var parent = item.get('parent');

      if (parent) {
        var descendants = parent.get('children');

        _common.Array.remove(descendants, item);
      }

      self._setEvn(item);

      children.push(item);
    }

    return self;
  },
  _setEvn: function _setEvn(item) {
    var self = this;
    item._attrs.parent = self;
    item._attrs.context = self._attrs.context;
    item._attrs.canvas = self._attrs.canvas;
    var clip = item._attrs.attrs.clip;

    if (clip) {
      clip.set('parent', self);
      clip.set('context', self.get('context'));
    }

    if (item._attrs.isGroup) {
      var children = item._attrs.children;

      for (var i = 0, len = children.length; i < len; i++) {
        item._setEvn(children[i]);
      }
    }
  }
};
exports["default"] = _default;