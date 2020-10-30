"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _scale = require("@antv/scale");

var _catTick = _interopRequireDefault(require("./cat-tick"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _scale.registerTickMethod)('time-cat', _catTick["default"]);
var TimeCat = (0, _scale.getScale)('timeCat');
var _default = TimeCat;
exports["default"] = _default;