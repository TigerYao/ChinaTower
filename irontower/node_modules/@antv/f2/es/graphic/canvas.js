import EventEmit from './event/emit';
import EventController from './event/controller';
import CanvasElement from './canvas-element';
import { mix, getPixelRatio, isString, getDomById, getWidth, getHeight, isCanvasElement } from '../util/common';
import Container from './container';
import Group from './group';
import { requestAnimationFrame } from './util/requestAnimationFrame';

class Canvas extends EventEmit {
  get(name) {
    return this._attrs[name];
  }

  set(name, value) {
    this._attrs[name] = value;
  }

  constructor(cfg) {
    super();
    this._attrs = mix({
      type: 'canvas',
      children: []
    }, cfg);

    this._initPixelRatio();

    this._initCanvas();
  }

  _initPixelRatio() {
    var pixelRatio = this.get('pixelRatio');

    if (!pixelRatio) {
      this.set('pixelRatio', getPixelRatio());
    }
  }

  beforeDraw() {
    var context = this._attrs.context;
    var el = this._attrs.el;
    context && context.clearRect && context.clearRect(0, 0, el.width, el.height);
  }

  _initCanvas() {
    var self = this;
    var el = self.get('el');
    var context = self.get('context');

    if (!el && !context) {
      throw new Error('Please specify the id, el or context of the chart!');
    }

    var canvas;

    if (el) {
      // DOMElement or String
      canvas = isString(el) ? getDomById(el) : el;
    } else {
      // 说明没有指定el
      canvas = CanvasElement.create(context);
    }

    if (context && canvas && !canvas.getContext) {
      canvas.getContext = function () {
        return context;
      };
    }

    var width = self.get('width');

    if (!width) {
      width = getWidth(canvas);
    }

    var height = self.get('height');

    if (!height) {
      height = getHeight(canvas);
    }

    self.set('canvas', this);
    self.set('el', canvas);
    self.set('context', context || canvas.getContext('2d'));
    self.changeSize(width, height); // 初始化事件控制器

    var eventController = new EventController({
      canvas: this,
      el: canvas
    });
    self.set('eventController', eventController);
  }

  changeSize(width, height) {
    var pixelRatio = this.get('pixelRatio');
    var canvasDOM = this.get('el'); // HTMLCanvasElement or canvasElement
    // 浏览器环境设置style样式

    if (canvasDOM.style) {
      canvasDOM.style.width = width + 'px';
      canvasDOM.style.height = height + 'px';
    }

    if (isCanvasElement(canvasDOM)) {
      canvasDOM.width = width * pixelRatio;
      canvasDOM.height = height * pixelRatio;

      if (pixelRatio !== 1) {
        var ctx = this.get('context');
        ctx.scale(pixelRatio, pixelRatio);
      }
    }

    this.set('width', width);
    this.set('height', height);
  }

  getWidth() {
    var pixelRatio = this.get('pixelRatio');
    var width = this.get('width');
    return width * pixelRatio;
  }

  getHeight() {
    var pixelRatio = this.get('pixelRatio');
    var height = this.get('height');
    return height * pixelRatio;
  }

  getPointByClient(clientX, clientY) {
    var el = this.get('el');
    var bbox = el.getBoundingClientRect();
    var width = bbox.right - bbox.left;
    var height = bbox.bottom - bbox.top;
    return {
      x: (clientX - bbox.left) * (el.width / width),
      y: (clientY - bbox.top) * (el.height / height)
    };
  }

  _beginDraw() {
    this._attrs.toDraw = true;
  }

  _endDraw() {
    this._attrs.toDraw = false;
  }

  draw() {
    var self = this;

    function drawInner() {
      self.set('animateHandler', requestAnimationFrame(function () {
        self.set('animateHandler', undefined);

        if (self.get('toDraw')) {
          drawInner();
        }
      }));
      self.beforeDraw();

      try {
        var context = self._attrs.context;
        self.drawInner(context); // 支付宝，微信小程序，需要调context.draw才能完成绘制， 所以这里直接判断是否有.draw方法

        if (context.draw) {
          context.draw();
        }
      } catch (ev) {
        console.warn('error in draw canvas, detail as:');
        console.warn(ev);

        self._endDraw();
      }

      self._endDraw();
    }

    if (self.get('destroyed')) {
      return;
    }

    if (self.get('animateHandler')) {
      this._beginDraw();
    } else {
      drawInner();
    }
  }

  destroy() {
    if (this.get('destroyed')) {
      return;
    } // 需要清理 canvas 画布内容，否则会导致 spa 应用 ios 下 canvas 白屏
    // https://stackoverflow.com/questions/52532614/total-canvas-memory-use-exceeds-the-maximum-limit-safari-12
    // https://github.com/antvis/F2/issues/630


    var el = this.get('el');
    el.width = 0;
    el.height = 0;
    this.clear();
    this._attrs = {};
    this.set('destroyed', true);
  }

  isDestroyed() {
    return this.get('destroyed');
  }

}

mix(Canvas.prototype, Container, {
  getGroupClass() {
    return Group;
  }

});
export default Canvas;