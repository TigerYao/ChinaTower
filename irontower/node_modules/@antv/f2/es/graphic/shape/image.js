import { isNil } from '../../util/common';
import Shape from '../shape';

class ImageShape extends Shape {
  _initProperties() {
    super._initProperties();

    this._attrs.canFill = false;
    this._attrs.canStroke = false;
    this._attrs.loading = false;
    this._attrs.image = null;
    this._attrs.type = 'image';
  }

  getDefaultAttrs() {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }

  createPath(context) {
    var _this = this;

    var attrs = this.get('attrs');
    var {
      src
    } = attrs;

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
  }

  drawImage(context, image) {
    var attrs = this.get('attrs');
    var {
      x,
      y,
      width,
      height,
      sx,
      sy,
      swidth,
      sheight
    } = attrs;

    if (!isNil(sx) && !isNil(sy) && !isNil(swidth) && !isNil(sheight)) {
      context.drawImage(image, sx, sy, swidth, sheight, x, y, width, height);
    } else {
      context.drawImage(image, x, y, width, height);
    }
  }

  calculateBox() {
    var attrs = this.get('attrs');
    var {
      x,
      y,
      width,
      height
    } = attrs; // 和rect一样

    return {
      minX: x,
      minY: y,
      maxX: x + width,
      maxY: y + height
    };
  }

}

Shape.Image = ImageShape;
export default ImageShape;