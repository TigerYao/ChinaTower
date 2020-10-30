import { getHeight, getWidth } from '../../util/common';
import GuideBase from './base';

function getOffsetFromAlign(alignX, alignY, width, height) {
  var result = [];

  if (alignX === 'left' && alignY === 'top') {
    result[0] = 0;
    result[1] = 0;
  } else if (alignX === 'right' && alignY === 'top') {
    result[0] = -width;
    result[1] = 0;
  } else if (alignX === 'left' && alignY === 'bottom') {
    result[0] = 0;
    result[1] = Math.floor(-height);
  } else if (alignX === 'right' && alignY === 'bottom') {
    result[0] = Math.floor(-width);
    result[1] = Math.floor(-height);
  } else if (alignX === 'right' && alignY === 'middle') {
    result[0] = Math.floor(-width);
    result[1] = Math.floor(-height / 2);
  } else if (alignX === 'left' && alignY === 'middle') {
    result[0] = 0;
    result[1] = Math.floor(-height / 2);
  } else if (alignX === 'center' && alignY === 'bottom') {
    result[0] = Math.floor(-width / 2);
    result[1] = Math.floor(-height);
  } else if (alignX === 'center' && alignY === 'top') {
    result[0] = Math.floor(-width / 2);
    result[1] = 0;
  } else {
    result[0] = Math.floor(-width / 2);
    result[1] = Math.floor(-height / 2);
  }

  return result;
}

function modifyCSS(DOM, CSS) {
  for (var key in CSS) {
    if (CSS.hasOwnProperty(key)) {
      DOM.style[key] = CSS[key];
    }
  }

  return DOM;
}

function createDom(str) {
  var container = document.createElement('div');
  str = str.replace(/(^\s*)|(\s*$)/g, '');
  container.innerHTML = '' + str;
  return container.childNodes[0];
}

class Html extends GuideBase {
  _initDefaultCfg() {
    this.type = 'html';
    /**
     * dom position
     * @type {Object | Array}
     */

    this.position = null;
    /**
      * alignment for horizontal direction，can be 'left','center','right'
      * @type {String}
      */

    this.alignX = 'center';
    /**
      * alignment for vertical direction，can be 'top', 'middle', 'bottom'
      * @type {String}
      */

    this.alignY = 'middle';
    /**
      * offset for horizontal direction
      * @type {Number}
      */

    this.offsetX = null;
    /**
      * offset for vertical direction
      * @type {Number}
      */

    this.offsetY = null;
    /**
    * the html string
    *@type {String | Function}
    */

    this.html = null;
  } // override paint


  render(coord, container) {
    var self = this;
    var position = self.parsePoint(coord, self.position);

    if (!position) {
      return;
    }

    var myNode = createDom(self.html);
    myNode = modifyCSS(myNode, {
      position: 'absolute',
      top: Math.floor(position.y) + 'px',
      left: Math.floor(position.x) + 'px',
      visibility: 'hidden'
    });
    var canvasDom = container.get('canvas').get('el');
    var parentNode = canvasDom.parentNode;
    parentNode = modifyCSS(parentNode, {
      position: 'relative'
    });
    var wrapperNode = createDom('<div class="guideWapper" style="position: absolute;top: 0; left: 0;"></div>');
    parentNode.appendChild(wrapperNode);
    wrapperNode.appendChild(myNode);
    var canvasOffsetTop = canvasDom.offsetTop;
    var canvasOffsetLeft = canvasDom.offsetLeft;
    var {
      alignX,
      alignY,
      offsetX,
      offsetY
    } = self;
    var width = getWidth(myNode);
    var height = getHeight(myNode);
    var newOffset = getOffsetFromAlign(alignX, alignY, width, height);
    position.x = position.x + newOffset[0] + canvasOffsetLeft;
    position.y = position.y + newOffset[1] + canvasOffsetTop;

    if (offsetX) {
      position.x += offsetX;
    }

    if (offsetY) {
      position.y += offsetY;
    }

    modifyCSS(myNode, {
      top: Math.floor(position.y) + 'px',
      left: Math.floor(position.x) + 'px',
      visibility: 'visible'
    });
    self.element = wrapperNode;
  }

  remove() {
    var element = this.element;
    element && element.parentNode && element.parentNode.removeChild(element);
  }

}

GuideBase.Html = Html;
export default Html;