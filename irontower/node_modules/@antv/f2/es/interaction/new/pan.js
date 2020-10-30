import Base from './base';

class Pan extends Base {
  getDefaultCfg() {
    return {
      type: 'pan',
      startEvent: 'panstart',
      processEvent: 'pan',
      endEvent: 'panend'
    };
  }

  start() {
    var {
      context
    } = this;
    context.start();
  }

  process(e) {
    var {
      direction,
      deltaX
    } = e;

    if (direction === 'up' || direction === 'down') {
      return;
    }

    e.preventDefault && e.preventDefault();
    var {
      context
    } = this;
    var chart = context.chart;
    var coord = chart.get('coord');
    var {
      start,
      end
    } = coord;
    var coordWidth = end.x - start.x;
    var ratio = deltaX / coordWidth;
    context.doMove(ratio);
  }

}

export default Pan;