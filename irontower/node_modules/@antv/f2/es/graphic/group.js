import { mix } from '../util/common';
import Element from './element';
import Container from './container';
import Vector2 from './util/vector2';

class Group extends Element {
  _initProperties() {
    this._attrs = {
      zIndex: 0,
      visible: true,
      destroyed: false,
      isGroup: true,
      children: []
    };
  }

  getBBox() {
    var self = this;
    var minX = Infinity;
    var maxX = -Infinity;
    var minY = Infinity;
    var maxY = -Infinity;
    var children = self.get('children');

    for (var i = 0, length = children.length; i < length; i++) {
      var child = children[i];

      if (child.get('visible')) {
        var box = child.getBBox();

        if (!box) {
          continue;
        }

        var leftTop = [box.minX, box.minY];
        var leftBottom = [box.minX, box.maxY];
        var rightTop = [box.maxX, box.minY];
        var rightBottom = [box.maxX, box.maxY];
        var matrix = child.attr('matrix');
        Vector2.transformMat2d(leftTop, leftTop, matrix);
        Vector2.transformMat2d(leftBottom, leftBottom, matrix);
        Vector2.transformMat2d(rightTop, rightTop, matrix);
        Vector2.transformMat2d(rightBottom, rightBottom, matrix);
        minX = Math.min(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0], minX);
        maxX = Math.max(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0], maxX);
        minY = Math.min(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1], minY);
        maxY = Math.max(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1], maxY);
      }
    }

    return {
      minX,
      minY,
      maxX,
      maxY,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  destroy() {
    if (this.get('destroyed')) {
      return;
    }

    this.clear();
    super.destroy();
  }

}

mix(Group.prototype, Container, {
  getGroupClass() {
    return Group;
  }

});
export default Group;