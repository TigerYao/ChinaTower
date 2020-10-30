"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _theme = _interopRequireDefault(require("./theme"));

var _common = require("./util/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Global = {
  version: '3.7.7',
  scales: {},
  widthRatio: {
    column: 1 / 2,
    rose: 0.999999,
    multiplePie: 3 / 4
  },
  lineDash: [4, 4]
};

Global.setTheme = function (theme) {
  (0, _common.deepMix)(this, theme);
};

Global.setTheme(_theme["default"]);
var _default = Global;
exports["default"] = _default;