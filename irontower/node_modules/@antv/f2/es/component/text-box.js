import { isNil, deepMix, mix, parsePadding, isObject } from '../util/common';
import { Group } from '../graphic/index';

class TextBox {
  getDefaultCfg() {
    return {
      x: 0,
      y: 0,
      content: '',
      textStyle: {
        fontSize: 12,
        fill: '#fff',
        textAlign: 'center',
        textBaseline: 'middle',
        fontFamily: 'Arial'
      },
      background: {
        radius: 1,
        fill: 'rgba(0, 0, 0, 0.65)',
        padding: [3, 5]
      },
      width: 0,
      height: 0,
      className: ''
    };
  }

  constructor(cfg) {
    deepMix(this, this.getDefaultCfg(), cfg);

    this._init();

    var {
      content,
      x,
      y
    } = this;

    if (!isNil(content)) {
      this.updateContent(content);
    }

    this.updatePosition(x, y);
  }

  _init() {
    var {
      content,
      textStyle,
      background,
      className,
      visible,
      context
    } = this;
    var container = new Group({
      context,
      className,
      zIndex: 0,
      visible
    });
    var text = container.addShape('Text', {
      className: className + '-text',
      zIndex: 1,
      attrs: mix({
        text: content,
        x: 0,
        y: 0
      }, textStyle)
    });
    var backgroundShape = container.addShape('Rect', {
      className: className + '-bg',
      zIndex: -1,
      attrs: mix({
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }, background)
    });
    container.sort();
    this.container = container;
    this.textShape = text;
    this.backgroundShape = backgroundShape;
  }

  _getBBox() {
    var textShape = this.textShape;
    var background = this.background;
    var textBBox = textShape.getBBox();
    var padding = parsePadding(background.padding);
    var width = textBBox.width + padding[1] + padding[3];
    var height = textBBox.height + padding[0] + padding[2];
    var x = textBBox.minX - padding[3];
    var y = textBBox.minY - padding[0];
    return {
      x,
      y,
      width,
      height
    };
  }

  updateContent(text) {
    var {
      textShape,
      backgroundShape
    } = this;

    if (!isNil(text)) {
      if (!isObject(text)) {
        text = {
          text
        };
      }

      textShape.attr(text); // update box shape

      var {
        x,
        y,
        width: tipWidth,
        height: tipHeight
      } = this._getBBox();

      var width = this.width || tipWidth;
      var height = this.height || tipHeight;
      backgroundShape.attr({
        x,
        y,
        width,
        height
      });
      this._width = width;
      this._height = height;
      this.content = text.text;
    }
  }

  updatePosition(x, y) {
    var container = this.container;

    var {
      x: xMin,
      y: yMin
    } = this._getBBox();

    container.moveTo(x - xMin, y - yMin);
    this.x = x - xMin;
    this.y = y - yMin;
  }

  getWidth() {
    return this._width;
  }

  getHeight() {
    return this._height;
  }

  show() {
    this.container.show();
  }

  hide() {
    this.container.hide();
  }

  clear() {
    var container = this.container;
    container.clear();
    container.remove(true);
    this.container = null;
    this.textShape = null;
    this.backgroundShape = null;
  }

}

export default TextBox;