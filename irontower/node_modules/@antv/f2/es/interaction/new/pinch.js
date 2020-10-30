import Base from './base';
import { mix } from '../../util/common';

class Pinch extends Base {
  getDefaultCfg() {
    return {
      type: 'pinch',
      startEvent: 'pinchstart',
      processEvent: 'pinch',
      endEvent: 'pinchend'
    };
  }

  constructor(cfg, chart) {
    super(cfg, chart);
    var {
      context
    } = this;
    mix(context, cfg);
  }

  start() {
    var {
      context
    } = this;
    context.start();
  }

  process(e) {
    e.preventDefault && e.preventDefault();
    var {
      zoom,
      center
    } = e;
    var {
      context
    } = this;
    var {
      chart
    } = context;
    var coord = chart.get('coord');
    var {
      start,
      end
    } = coord;
    var coordWidth = end.x - start.x;
    var leftLen = Math.abs(center.x - start.x);
    var rightLen = Math.abs(end.x - center.x); // 计算左右缩放的比例

    var leftScale = leftLen / coordWidth;
    var rightScale = rightLen / coordWidth;
    context.doZoom(leftScale, rightScale, zoom);
  }

  end() {
    // 缩放完成后再更新ticks
    var {
      context
    } = this;
    context.updateTicks();
  }

}

export default Pinch;