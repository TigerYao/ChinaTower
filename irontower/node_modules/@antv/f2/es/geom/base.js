function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as Attr from '../attr/index';
import { isArray, isString, each, isFunction, upperFirst, mix, isNil, isObject, Array as ArrayUtil, toTimeStamp } from '../util/common';
import Base from '../base';
import Global from '../global';
import GeometryShape from './shape/shape';
import Adjust from '@antv/adjust/lib/base';
var GROUP_ATTRS = ['color', 'size', 'shape'];
var FIELD_ORIGIN = '_origin';
var FIELD_ORIGIN_Y = '_originY';

function parseFields(field) {
  if (isArray(field)) {
    return field;
  }

  if (isString(field)) {
    return field.split('*');
  }

  return [field];
}
/**
 * The parent class for Geometry
 * @class Geom
 */


class Geom extends Base {
  getDefaultCfg() {
    return {
      /**
       * geometry type
       * @type {String}
       */
      type: null,

      /**
       * the data of geometry
       * @type {Array}
       */
      data: null,

      /**
       * the attrs of geo,etry
       * @type {Object}
       */
      attrs: {},
      scales: {},

      /**
       * group for storing the shapes
       * @type {Canvas}
       */
      container: null,

      /**
       * style options
       * @type {Object}
       */
      styleOptions: null,
      chart: null,
      shapeType: '',

      /**
       * wether to generate key points for each shape
       * @protected
       * @type {Boolean}
       */
      generatePoints: false,
      attrOptions: {},
      sortable: false,
      startOnZero: true,
      visible: true,
      connectNulls: false,
      // 是否丢弃没有值的分组。
      ignoreEmptyGroup: false,
      // 是否已经初始化
      isInit: false
    };
  }

  init() {
    var self = this;
    var isInit = self.get('isInit');

    if (isInit) {
      return;
    }

    self._initAttrs();

    self._processData();

    self.set('isInit', true);
  }

  _getGroupScales() {
    var self = this;
    var scales = [];
    each(GROUP_ATTRS, function (attrName) {
      var attr = self.getAttr(attrName);

      if (attr) {
        var attrScales = attr.scales;
        each(attrScales, function (scale) {
          if (scale && scale.isCategory && scales.indexOf(scale) === -1) {
            scales.push(scale);
          }
        });
      }
    });
    return scales;
  }

  _groupData(data) {
    var self = this;
    var colDefs = self.get('colDefs');

    var groupScales = self._getGroupScales();

    if (groupScales.length) {
      var appendConditions = {};
      var names = [];
      each(groupScales, function (scale) {
        var field = scale.field;
        names.push(field);

        if (colDefs && colDefs[field] && colDefs[field].values) {
          // users have defined
          appendConditions[scale.field] = colDefs[field].values;
        }
      });
      return ArrayUtil.group(data, names, appendConditions);
    }

    return [data];
  }

  _setAttrOptions(attrName, attrCfg) {
    var options = this.get('attrOptions');
    options[attrName] = attrCfg;
    var attrs = this.get('attrs'); // 说明已经初始化过了

    if (Object.keys(attrs).length) {
      this._createAttr(attrName, attrCfg);
    }
  }

  _createAttrOption(attrName, field, cfg, defaultValues) {
    var attrCfg = {};
    attrCfg.field = field;

    if (cfg) {
      if (isFunction(cfg)) {
        attrCfg.callback = cfg;
      } else {
        attrCfg.values = cfg;
      }
    } else {
      attrCfg.values = defaultValues;
    }

    this._setAttrOptions(attrName, attrCfg);
  }

  _createAttr(type, option) {
    var self = this;
    var attrs = self.get('attrs');
    var coord = self.get('coord');
    var className = upperFirst(type);
    var fields = parseFields(option.field);

    if (type === 'position') {
      option.coord = coord;
    }

    var scales = [];

    for (var i = 0, len = fields.length; i < len; i++) {
      var field = fields[i];

      var scale = self._createScale(field);

      scales.push(scale);
    }

    if (type === 'position') {
      var yScale = scales[1]; // 饼图的处理，但是还不知道为啥

      if (coord.type === 'polar' && coord.transposed && self.hasAdjust('stack')) {
        if (yScale.values.length) {
          yScale.change({
            nice: false,
            min: 0,
            max: Math.max.apply(null, yScale.values)
          });
        }
      }
    }

    option.scales = scales;
    var attr = new Attr[className](option);
    attrs[type] = attr;
    return attr;
  }

  _initAttrs() {
    var self = this;
    var attrOptions = self.get('attrOptions');

    for (var type in attrOptions) {
      if (attrOptions.hasOwnProperty(type)) {
        this._createAttr(type, attrOptions[type]);
      }
    }
  }

  _createScale(field) {
    var scales = this.get('scales');
    var scale = scales[field];

    if (!scale) {
      scale = this.get('chart').createScale(field);
      scales[field] = scale;
    }

    return scale;
  }

  _processData() {
    var self = this;
    var data = this.get('data');
    var dataArray = [];

    var groupedArray = this._groupData(data);

    if (this.get('ignoreEmptyGroup')) {
      var yScale = this.getYScale();
      groupedArray = groupedArray.filter(function (group) {
        return group.some(function (item) {
          return typeof item[yScale.field] !== 'undefined';
        });
      });
    }

    for (var i = 0, len = groupedArray.length; i < len; i++) {
      var subData = groupedArray[i];

      var tempData = self._saveOrigin(subData);

      if (this.hasAdjust('dodge')) {
        self._numberic(tempData);
      }

      dataArray.push(tempData);
    }

    if (self.get('adjust')) {
      self._adjustData(dataArray);
    }

    if (self.get('sortable')) {
      self._sort(dataArray);
    }

    self.emit('afterprocessdata', {
      dataArray
    });
    self.set('mappingData', dataArray);
    self.set('dataArray', dataArray);
    return dataArray;
  }

  _saveOrigin(data) {
    var rst = [];

    for (var i = 0, len = data.length; i < len; i++) {
      var origin = data[i];
      var obj = {};

      for (var k in origin) {
        obj[k] = origin[k];
      }

      obj[FIELD_ORIGIN] = origin;
      rst.push(obj);
    }

    return rst;
  }

  _numberic(data) {
    var positionAttr = this.getAttr('position');
    var scales = positionAttr.scales;

    for (var j = 0, len = data.length; j < len; j++) {
      var obj = data[j];
      var count = Math.min(2, scales.length);

      for (var i = 0; i < count; i++) {
        var scale = scales[i];

        if (scale.isCategory) {
          var field = scale.field;
          obj[field] = scale.translate(obj[field]);
        }
      }
    }
  }

  _adjustData(dataArray) {
    var self = this;
    var adjust = self.get('adjust');

    if (adjust) {
      var adjustType = upperFirst(adjust.type);

      if (!Adjust[adjustType]) {
        throw new Error('not support such adjust : ' + adjust);
      }

      var xScale = self.getXScale();
      var yScale = self.getYScale();
      var cfg = mix({
        xField: xScale.field,
        yField: yScale.field
      }, adjust);
      var adjustObject = new Adjust[adjustType](cfg);
      adjustObject.processAdjust(dataArray);

      if (adjustType === 'Stack') {
        self._updateStackRange(yScale.field, yScale, dataArray);
      }
    }
  }

  _updateStackRange(field, scale, dataArray) {
    var mergeArray = ArrayUtil.merge(dataArray);
    var min = scale.min;
    var max = scale.max;

    for (var i = 0, len = mergeArray.length; i < len; i++) {
      var obj = mergeArray[i];
      var tmpMin = Math.min.apply(null, obj[field]);
      var tmpMax = Math.max.apply(null, obj[field]);

      if (tmpMin < min) {
        min = tmpMin;
      }

      if (tmpMax > max) {
        max = tmpMax;
      }
    }

    if (min < scale.min || max > scale.max) {
      scale.change({
        min,
        max
      });
    }
  }

  _sort(mappedArray) {
    var self = this;
    var xScale = self.getXScale();
    var {
      field,
      type
    } = xScale;

    if (type !== 'identity' && xScale.values.length > 1) {
      each(mappedArray, function (itemArr) {
        itemArr.sort(function (obj1, obj2) {
          if (type === 'timeCat') {
            return toTimeStamp(obj1[FIELD_ORIGIN][field]) - toTimeStamp(obj2[FIELD_ORIGIN][field]);
          }

          return xScale.translate(obj1[FIELD_ORIGIN][field]) - xScale.translate(obj2[FIELD_ORIGIN][field]);
        });
      });
    }

    self.set('hasSorted', true);
    self.set('dataArray', mappedArray);
  }

  paint() {
    var self = this;
    var dataArray = self.get('mappingData');
    var mappedArray = [];
    var shapeFactory = self.getShapeFactory();
    shapeFactory.setCoord(self.get('coord'));

    self._beforeMapping(dataArray);

    for (var i = 0, len = dataArray.length; i < len; i++) {
      var data = dataArray[i];

      if (data.length) {
        var mappedData = self._mapping(data);

        mappedArray.push(mappedData);
        self.draw(mappedData, shapeFactory);
      }
    }

    self.set('dataArray', mappedArray);
  }

  getShapeFactory() {
    var shapeFactory = this.get('shapeFactory');

    if (!shapeFactory) {
      var shapeType = this.get('shapeType');
      shapeFactory = GeometryShape.getShapeFactory(shapeType);
      this.set('shapeFactory', shapeFactory);
    }

    return shapeFactory;
  }

  _mapping(data) {
    var self = this;
    var attrs = self.get('attrs');
    var yField = self.getYScale().field; // 用来缓存转换的值，减少mapping耗时

    var mappedCache = {};
    var mappedData = new Array(data.length);

    for (var k in attrs) {
      if (attrs.hasOwnProperty(k)) {
        var attr = attrs[k];
        var names = attr.names;
        var scales = attr.scales;

        for (var i = 0, len = data.length; i < len; i++) {
          var record = data[i];

          var mappedRecord = _objectSpread(_objectSpread({}, record), mappedData[i]);

          mappedRecord[FIELD_ORIGIN_Y] = record[yField]; // 获取视觉属性对应的value值
          // 位置的缓存命中率低，还是每次单独计算

          if (attr.type === 'position') {
            var values = self._getAttrValues(attr, record);

            for (var j = 0, _len = values.length; j < _len; j++) {
              var val = values[j];
              var name = names[j];
              mappedRecord[name] = isArray(val) && val.length === 1 ? val[0] : val;
            }
          } else {
            // 除了position其他都只有一项
            var _name = names[0];
            var field = scales[0].field;
            var value = record[field];
            var key = "".concat(_name).concat(value);
            var _values = mappedCache[key];

            if (!_values) {
              _values = self._getAttrValues(attr, record);
              mappedCache[key] = _values;
            }

            mappedRecord[_name] = _values[0];
          } // 设置新数组


          mappedData[i] = mappedRecord;
        }
      }
    }

    return mappedData;
  }

  _getAttrValues(attr, record) {
    var scales = attr.scales;
    var params = [];

    for (var i = 0, len = scales.length; i < len; i++) {
      var scale = scales[i];
      var field = scale.field;

      if (scale.type === 'identity') {
        params.push(scale.value);
      } else {
        params.push(record[field]);
      }
    }

    var values = attr.mapping(...params);
    return values;
  }

  getAttrValue(attrName, record) {
    var attr = this.getAttr(attrName);
    var rst = null;

    if (attr) {
      var values = this._getAttrValues(attr, record);

      rst = values[0];
    }

    return rst;
  }

  _beforeMapping(dataArray) {
    var self = this;

    if (self.get('generatePoints')) {
      self._generatePoints(dataArray);
    }
  }

  isInCircle() {
    var coord = this.get('coord');
    return coord && coord.isPolar;
  }

  getCallbackCfg(fields, cfg, origin) {
    if (!fields) {
      return cfg;
    }

    var tmpCfg = {};
    var params = fields.map(function (field) {
      return origin[field];
    });
    each(cfg, function (v, k) {
      if (isFunction(v)) {
        tmpCfg[k] = v.apply(null, params);
      } else {
        tmpCfg[k] = v;
      }
    });
    return tmpCfg;
  }

  getDrawCfg(obj) {
    var self = this;
    var isInCircle = self.isInCircle();
    var cfg = {
      origin: obj,
      x: obj.x,
      y: obj.y,
      color: obj.color,
      size: obj.size,
      shape: obj.shape,
      isInCircle,
      opacity: obj.opacity
    };
    var styleOptions = self.get('styleOptions');

    if (styleOptions && styleOptions.style) {
      cfg.style = self.getCallbackCfg(styleOptions.fields, styleOptions.style, obj[FIELD_ORIGIN]);
    }

    if (self.get('generatePoints')) {
      cfg.points = obj.points;
      cfg.nextPoints = obj.nextPoints;
    }

    if (isInCircle) {
      cfg.center = self.get('coord').center;
    }

    return cfg;
  }

  draw(data, shapeFactory) {
    var self = this;
    var container = self.get('container');
    var yScale = self.getYScale();
    each(data, function (obj, index) {
      if (yScale && isNil(obj._origin[yScale.field])) {
        return;
      }

      obj.index = index;
      var cfg = self.getDrawCfg(obj);
      var shape = obj.shape;
      self.drawShape(shape, obj, cfg, container, shapeFactory);
    });
  }

  drawShape(shape, shapeData, cfg, container, shapeFactory) {
    var gShape = shapeFactory.drawShape(shape, cfg, container);

    if (gShape) {
      each([].concat(gShape), function (s) {
        s.set('origin', shapeData);
      });
    }
  }

  _generatePoints(dataArray) {
    var self = this;
    var shapeFactory = self.getShapeFactory();
    var shapeAttr = self.getAttr('shape');
    each(dataArray, function (data) {
      for (var i = 0, len = data.length; i < len; i++) {
        var obj = data[i];
        var cfg = self.createShapePointsCfg(obj);
        var shape = shapeAttr ? self._getAttrValues(shapeAttr, obj) : null;
        var points = shapeFactory.getShapePoints(shape, cfg);
        obj.points = points;
      }
    }); // 添加nextPoints

    each(dataArray, function (data, index) {
      var nextData = dataArray[index + 1];

      if (nextData) {
        data[0].nextPoints = nextData[0].points;
      }
    });
  }
  /**
   * get the info of each shape
   * @protected
   * @param  {Object} obj the data item
   * @return {Object} cfg return the result
   */


  createShapePointsCfg(obj) {
    var xScale = this.getXScale();
    var yScale = this.getYScale();

    var x = this._normalizeValues(obj[xScale.field], xScale);

    var y;

    if (yScale) {
      y = this._normalizeValues(obj[yScale.field], yScale);
    } else {
      y = obj.y ? obj.y : 0.1;
    }

    return {
      x,
      y,
      y0: yScale ? yScale.scale(this.getYMinValue()) : undefined
    };
  }

  getYMinValue() {
    var yScale = this.getYScale();
    var {
      min,
      max
    } = yScale;
    var value;

    if (this.get('startOnZero')) {
      if (max <= 0 && min <= 0) {
        value = max;
      } else {
        value = min >= 0 ? min : 0;
      }
    } else {
      value = min;
    }

    return value;
  }

  _normalizeValues(values, scale) {
    var rst = [];

    if (isArray(values)) {
      for (var i = 0, len = values.length; i < len; i++) {
        var v = values[i];
        rst.push(scale.scale(v));
      }
    } else {
      rst = scale.scale(values);
    }

    return rst;
  }

  getAttr(name) {
    return this.get('attrs')[name];
  }

  getXScale() {
    return this.getAttr('position').scales[0];
  }

  getYScale() {
    return this.getAttr('position').scales[1];
  }

  hasAdjust(adjust) {
    return this.get('adjust') && this.get('adjust').type === adjust;
  }

  _getSnap(scale, item, arr) {
    var i = 0;
    var values;
    var yField = this.getYScale().field; // 叠加的维度

    if (this.hasAdjust('stack') && scale.field === yField) {
      values = [];
      arr.forEach(function (obj) {
        values.push(obj[FIELD_ORIGIN_Y]);
      });

      for (var len = values.length; i < len; i++) {
        if (values[0][0] > item) {
          break;
        }

        if (values[values.length - 1][1] <= item) {
          i = values.length - 1;
          break;
        }

        if (values[i][0] <= item && values[i][1] > item) {
          break;
        }
      }
    } else {
      values = scale.values;
      values.sort(function (a, b) {
        return a - b;
      });

      for (var _len2 = values.length; i < _len2; i++) {
        // 如果只有1个点直接返回第1个点
        if (_len2 <= 1) {
          break;
        } // 第1个点和第2个点之间


        if ((values[0] + values[1]) / 2 > item) {
          break;
        } // 中间的点


        if ((values[i - 1] + values[i]) / 2 <= item && (values[i + 1] + values[i]) / 2 > item) {
          break;
        } // 最后2个点


        if ((values[values.length - 2] + values[values.length - 1]) / 2 <= item) {
          i = values.length - 1;
          break;
        }
      }
    }

    var result = values[i];
    return result;
  }

  getSnapRecords(point) {
    var self = this;
    var coord = self.get('coord');
    var xScale = self.getXScale();
    var yScale = self.getYScale();
    var xfield = xScale.field;
    var dataArray = self.get('dataArray');

    if (!this.get('hasSorted')) {
      this._sort(dataArray);
    }

    var rst = [];
    var invertPoint = coord.invertPoint(point);
    var invertPointX = invertPoint.x;

    if (self.isInCircle() && !coord.transposed && invertPointX > (1 + xScale.rangeMax()) / 2) {
      invertPointX = xScale.rangeMin();
    }

    var xValue = xScale.invert(invertPointX);

    if (!xScale.isCategory) {
      xValue = self._getSnap(xScale, xValue);
    }

    var tmp = [];
    dataArray.forEach(function (data) {
      data.forEach(function (obj) {
        var originValue = isNil(obj[FIELD_ORIGIN]) ? obj[xfield] : obj[FIELD_ORIGIN][xfield];

        if (self._isEqual(originValue, xValue, xScale)) {
          tmp.push(obj);
        }
      });
    }); // special for pie chart

    if (this.hasAdjust('stack') && coord.isPolar && coord.transposed) {
      if (invertPointX >= 0 && invertPointX <= 1) {
        var yValue = yScale.invert(invertPoint.y);
        yValue = self._getSnap(yScale, yValue, tmp);
        tmp.forEach(function (obj) {
          if (isArray(yValue) ? obj[FIELD_ORIGIN_Y].toString() === yValue.toString() : obj[FIELD_ORIGIN_Y] === yValue) {
            rst.push(obj);
          }
        });
      }
    } else {
      rst = tmp;
    }

    return rst;
  }

  getRecords(value) {
    var _this = this;

    var xScale = this.getXScale();
    var dataArray = this.get('dataArray');
    var xfield = xScale.field;
    return dataArray.map(function (data) {
      for (var len = data.length, i = len - 1; i >= 0; i--) {
        var obj = data[i];
        var originValue = isNil(obj[FIELD_ORIGIN]) ? obj[xfield] : obj[FIELD_ORIGIN][xfield];

        if (_this._isEqual(originValue, value, xScale)) {
          return obj;
        }
      }

      return null;
    });
  }

  _isEqual(originValue, value, scale) {
    if (scale.type === 'timeCat') {
      return toTimeStamp(originValue) === value;
    }

    return value === originValue;
  }

  position(field) {
    this._setAttrOptions('position', {
      field
    });

    return this;
  }

  color(field, values) {
    this._createAttrOption('color', field, values, Global.colors);

    return this;
  }

  size(field, values) {
    this._createAttrOption('size', field, values, Global.sizes);

    return this;
  }

  shape(field, values) {
    var type = this.get('type');
    var shapes = Global.shapes[type] || [];

    this._createAttrOption('shape', field, values, shapes);

    return this;
  }

  style(field, cfg) {
    var styleOptions = this.get('styleOptions');

    if (!styleOptions) {
      styleOptions = {};
      this.set('styleOptions', styleOptions);
    }

    if (isObject(field)) {
      cfg = field;
      field = null;
    }

    var fields;

    if (field) {
      fields = parseFields(field);
    }

    styleOptions.fields = fields;
    styleOptions.style = cfg;
    return this;
  }

  adjust(type) {
    if (isString(type)) {
      type = {
        type
      };
    }

    this.set('adjust', type);
    return this;
  }

  animate(cfg) {
    this.set('animateCfg', cfg);
    return this;
  }

  changeData(data) {
    this.set('data', data); // 改变数据后，情况度量，因为需要重新实例化

    this.set('scales', {});
    if (!this.get('isInit')) return;
    this.set('isInit', false);
    this.init();
  }

  clearInner() {
    var container = this.get('container');

    if (container) {
      container.clear(); // container.setMatrix([ 1, 0, 0, 1, 0, 0 ]);
    }
  }

  reset() {
    this.set('isInit', false);
    this.set('attrs', {});
    this.set('attrOptions', {});
    this.set('adjust', null);
    this.clearInner();
  }

  clear() {
    this.clearInner();
  }

  destroy() {
    this.set('isInit', false);
    this.clear();
    super.destroy();
  }

  _display(visible) {
    this.set('visible', visible);
    var container = this.get('container');
    var canvas = container.get('canvas');
    container.set('visible', visible);
    canvas.draw();
  }

  show() {
    this._display(true);
  }

  hide() {
    this._display(false);
  }

}

export default Geom;