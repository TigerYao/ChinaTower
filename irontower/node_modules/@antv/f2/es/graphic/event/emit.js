// 实现简单的事件机制
import { isObject } from '../../util/common';

class EventEmit {
  constructor() {
    this.__events = {};
  }

  on(type, listener) {
    if (!type || !listener) {
      return;
    }

    var events = this.__events[type] || [];
    events.push(listener);
    this.__events[type] = events;
  }

  emit(type, e) {
    var _this = this;

    if (isObject(type)) {
      e = type;
      type = e && e.type;
    }

    if (!type) {
      return;
    }

    var events = this.__events[type];

    if (!events || !events.length) {
      return;
    }

    events.forEach(function (listener) {
      listener.call(_this, e);
    });
  }

  off(type, listener) {
    var __events = this.__events;
    var events = __events[type];

    if (!events || !events.length) {
      return;
    } // 如果没有指定方法，则删除所有项


    if (!listener) {
      delete __events[type];
      return;
    } // 删除指定的 listener


    for (var i = 0, len = events.length; i < len; i++) {
      if (events[i] === listener) {
        events.splice(i, 1);
        i--;
      }
    }
  }

}

export default EventEmit;