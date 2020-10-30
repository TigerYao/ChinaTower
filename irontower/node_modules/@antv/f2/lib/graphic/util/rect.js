"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var Rect = {
  calcRotatedBox: function calcRotatedBox(_ref) {
    var width = _ref.width,
        height = _ref.height,
        rotate = _ref.rotate;
    var absRotate = Math.abs(rotate);
    return {
      width: Math.abs(width * Math.cos(absRotate) + height * Math.sin(absRotate)),
      height: Math.abs(height * Math.cos(absRotate) + width * Math.sin(absRotate))
    };
  }
};
var _default = Rect;
exports["default"] = _default;