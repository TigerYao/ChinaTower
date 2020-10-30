"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _common = require("../../util/common");

var _shape = _interopRequireDefault(require("../shape"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var ImageShape = /*#__PURE__*/function (_Shape) {
  _inheritsLoose(ImageShape, _Shape);

  function ImageShape() {
    return _Shape.apply(this, arguments) || this;
  }

  var _proto = ImageShape.prototype;

  _proto._initProperties = function _initProperties() {
    _Shape.prototype._initProperties.call(this);

    this._attrs.canFill = false;
    this._attrs.canStroke = false;
    this._attrs.loading = false;
    this._attrs.image = null;
    this._attrs.type = 'image';
  };

  _proto.getDefaultAttrs = function getDefaultAttrs() {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  };

  _proto.createPath = function createPath(context) {
    var _this = this;

    var attrs = this.get('attrs');
    var src = attrs.src;

    if (this.get('loading')) {
      return;
    }

    var image = this.get('image');

    if (image) {
      this.drawImage(context, image);
    } else {
      if (src && Image) {
        this.set('loading', true);

        var _image = new Image();

        _image.src = src; // 设置跨域

        _image.crossOrigin = 'Anonymous';

        _image.onload = function () {
          _this.set('loading', false);

          _this.set('image', _image);

          _this.drawImage(context, _image);
        };
      }
    }
  };

  _proto.drawImage = function drawImage(context, image) {
    var attrs = this.get('attrs');
    var x = attrs.x,
        y = attrs.y,
        width = attrs.width,
        height = attrs.height,
        sx = attrs.sx,
        sy = attrs.sy,
        swidth = attrs.swidth,
        sheight = attrs.sheight;

    if (!(0, _common.isNil)(sx) && !(0, _common.isNil)(sy) && !(0, _common.isNil)(swidth) && !(0, _common.isNil)(sheight)) {
      context.drawImage(image, sx, sy, swidth, sheight, x, y, width, height);
    } else {
      context.drawImage(image, x, y, width, height);
    }
  };

  _proto.calculateBox = function calculateBox() {
    var attrs = this.get('attrs');
    var x = attrs.x,
        y = attrs.y,
        width = attrs.width,
        height = attrs.height; // 和rect一样

    return {
      minX: x,
      minY: y,
      maxX: x + width,
      maxY: y + height
    };
  };

  return ImageShape;
}(_shape["default"]);

_shape["default"].Image = ImageShape;
var _default = ImageShape;
exports["default"] = _default;