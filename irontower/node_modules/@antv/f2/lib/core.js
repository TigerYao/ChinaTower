"use strict";

exports.__esModule = true;
exports.Helper = exports.Util = exports.G = exports.track = exports.version = void 0;

var _global = _interopRequireDefault(require("./global"));

exports.Global = _global["default"];

var _chart = _interopRequireDefault(require("./chart/chart"));

exports.Chart = _chart["default"];

var _shape = _interopRequireDefault(require("./geom/shape/shape"));

exports.Shape = _shape["default"];

var G = _interopRequireWildcard(require("./graphic/index"));

exports.G = G;

var Util = _interopRequireWildcard(require("./util/common"));

exports.Util = Util;

var Helper = _interopRequireWildcard(require("./util/helper"));

exports.Helper = Helper;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var track = function track() {
  return null;
};

exports.track = track;
var version = _global["default"].version;
exports.version = version;