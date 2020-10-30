import Base from './base';

class Shape extends Base {
  constructor(cfg) {
    super(cfg);
    this.names = ['shape'];
    this.type = 'shape';
    this.gradient = null;
  }
  /**
   * @override
   */


  getLinearValue(percent) {
    var values = this.values;
    var index = Math.round((values.length - 1) * percent);
    return values[index];
  }

}

export default Shape;