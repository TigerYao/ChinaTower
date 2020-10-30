"use strict";

var _register = _interopRequireDefault(require("../register"));

var _pan = _interopRequireDefault(require("./pan"));

var _pinch = _interopRequireDefault(require("./pinch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 注册交互
_register["default"].registerInteraction('pan', _pan["default"]);

_register["default"].registerInteraction('pinch', _pinch["default"]);