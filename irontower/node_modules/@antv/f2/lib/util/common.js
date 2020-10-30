"use strict";

exports.__esModule = true;
var _exportNames = {
  isObjectValueEqual: true,
  parsePadding: true,
  directionEnabled: true,
  toTimeStamp: true,
  upperFirst: true,
  lowerFirst: true,
  isString: true,
  isNumber: true,
  isBoolean: true,
  isFunction: true,
  isDate: true,
  isArray: true,
  isNil: true,
  isObject: true,
  isPlainObject: true,
  isEqual: true,
  deepMix: true,
  mix: true,
  each: true,
  uniq: true,
  find: true,
  Array: true
};
exports.isObjectValueEqual = isObjectValueEqual;
exports.parsePadding = parsePadding;
exports.directionEnabled = directionEnabled;
exports.toTimeStamp = toTimeStamp;
exports.Array = void 0;

var _util = require("@antv/util");

exports.upperFirst = _util.upperFirst;
exports.lowerFirst = _util.lowerFirst;
exports.isString = _util.isString;
exports.isNumber = _util.isNumber;
exports.isBoolean = _util.isBoolean;
exports.isFunction = _util.isFunction;
exports.isDate = _util.isDate;
exports.isArray = _util.isArray;
exports.isNil = _util.isNil;
exports.isObject = _util.isObject;
exports.isPlainObject = _util.isPlainObject;
exports.isEqual = _util.isEqual;
exports.deepMix = _util.deepMix;
exports.mix = _util.mix;
exports.each = _util.each;
exports.uniq = _util.uniq;
exports.find = _util.find;

var ArrayUtil = _interopRequireWildcard(require("./array"));

exports.Array = ArrayUtil;

var _dom = require("./dom");

Object.keys(_dom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _dom[key];
});

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * @fileOverview Utility for F2
 * @author dxq613 @gmail.com
 * @author sima.zhang1990@gmail.com
 */
function isObjectValueEqual(a, b) {
  // for vue.js
  a = Object.assign({}, a);
  b = Object.assign({}, b);
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) {
    return false;
  }

  for (var i = 0, len = aProps.length; i < len; i++) {
    var propName = aProps[i];

    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  return true;
}

function parsePadding(padding) {
  var top;
  var right;
  var bottom;
  var left;

  if ((0, _util.isNumber)(padding) || (0, _util.isString)(padding)) {
    top = bottom = left = right = padding;
  } else if ((0, _util.isArray)(padding)) {
    top = padding[0];
    right = !(0, _util.isNil)(padding[1]) ? padding[1] : padding[0];
    bottom = !(0, _util.isNil)(padding[2]) ? padding[2] : padding[0];
    left = !(0, _util.isNil)(padding[3]) ? padding[3] : right;
  }

  return [top, right, bottom, left];
}

function directionEnabled(mode, dir) {
  if (mode === undefined) {
    return true;
  } else if (typeof mode === 'string') {
    return mode.indexOf(dir) !== -1;
  }

  return false;
}

function toTimeStamp(value) {
  if ((0, _util.isString)(value)) {
    if (value.indexOf('T') > 0) {
      value = new Date(value).getTime();
    } else {
      // new Date('2010/01/10') 和 new Date('2010-01-10') 的差别在于:
      // 如果仅有年月日时，前者是带有时区的: Fri Jan 10 2020 02:40:13 GMT+0800 (中国标准时间)
      // 后者会格式化成 Sun Jan 10 2010 08:00:00 GMT+0800 (中国标准时间)
      value = new Date(value.replace(/-/gi, '/')).getTime();
    }
  }

  if ((0, _util.isDate)(value)) {
    value = value.getTime();
  }

  return value;
}