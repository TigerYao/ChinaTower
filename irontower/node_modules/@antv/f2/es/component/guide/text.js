import { mix } from '../../util/common';
import GuideBase from './base';

class Text extends GuideBase {
  _initDefaultCfg() {
    this.type = 'text';
    /**
     * the position of text
     * @type {Function | Array}
     */

    this.position = null;
    /**
     * the display content
     * @type {String}
     */

    this.content = null;
    /**
     * style configuration for text
     * @type {Object}
     */

    this.style = {
      fill: '#000'
    };
    /**
     * offset of horizontal direction
     * @type {Number}
     */

    this.offsetX = 0;
    /**
     * offset of vertical direction
     * @type {Number}
     */

    this.offsetY = 0;
  }

  render(coord, container) {
    var position = this.position;
    var point = this.parsePoint(coord, position);

    if (!point) {
      return;
    }

    var {
      content,
      style,
      offsetX,
      offsetY
    } = this;

    if (offsetX) {
      point.x += offsetX;
    }

    if (offsetY) {
      point.y += offsetY;
    }

    var shape = container.addShape('text', {
      className: 'guide-text',
      attrs: mix({
        x: point.x,
        y: point.y,
        text: content
      }, style)
    });
    this.element = shape;
    return shape;
  }

}

GuideBase.Text = Text;
export default Text;