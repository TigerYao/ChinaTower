import Shape from '../shape';

class Custom extends Shape {
  _initProperties() {
    super._initProperties();

    this._attrs.canFill = true;
    this._attrs.canStroke = true;
    this._attrs.createPath = null;
    this._attrs.type = 'custom';
  }

  createPath(context) {
    var createPath = this.get('createPath');
    createPath && createPath.call(this, context);
  }

  calculateBox() {
    var calculateBox = this.get('calculateBox');
    return calculateBox && calculateBox.call(this);
  }

}

Shape.Custom = Custom;
export default Custom;