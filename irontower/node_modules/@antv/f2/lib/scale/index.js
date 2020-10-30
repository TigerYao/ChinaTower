"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _scale = require("@antv/scale");

exports.getScale = _scale.getScale;
exports.getTickMethod = _scale.getTickMethod;

var _catTick = _interopRequireDefault(require("./cat-tick"));

var _linearTick = _interopRequireDefault(require("./linear-tick"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Linear = (0, _scale.getScale)('linear');
var Identity = (0, _scale.getScale)('identity');
var Category = (0, _scale.getScale)('category');
var TimeCat = (0, _scale.getScale)('timeCat'); // 覆盖0.3.x的 cat 方法

(0, _scale.registerTickMethod)('cat', _catTick["default"]);
(0, _scale.registerTickMethod)('time-cat', _catTick["default"]); // 覆盖linear 度量的tick算法

(0, _scale.registerTickMethod)('wilkinson-extended', _linearTick["default"]);
_scale.Scale.Linear = Linear;
_scale.Scale.Identity = Identity;
_scale.Scale.Category = Category;
_scale.Scale.Cat = Category;
_scale.Scale.TimeCat = TimeCat;
var _default = _scale.Scale;
exports["default"] = _default;