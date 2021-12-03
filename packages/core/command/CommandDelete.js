Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

export default class CommandDelete {
  constructor(obj) {
    this.props = obj?.props;
    this.layouts = obj?.layouts;
    this.breakpoint = obj?.breakpoint;
    this.widgets = obj?.widgets;
    this.deletedArr = [];
  }

  execute() {
    let layoutList = this.layouts[this.breakpoint];
    let keepList = this.widgets.filter((item) => {
      return !item.selected;
    });
    let removeList = this.widgets.filter((item) => {
      return item.selected;
    });
    removeList.forEach((item) => {
      layoutList.forEach((item1) => {
        if (item1.i == item.i) {
          item.x = item1.x;
          item.y = item1.y;
          item.w = item1.w;
          item.h = item1.h;
          this.deletedArr.push(item);
          this.props.logic.removeWidget(item.i);
        }
      });
    });
    return keepList;
  }

  // 后退
  undo = () => {
    return this.deletedArr;
  };

  // 前进
  redo = () => {
    console.log("redo");
  };

  undoable() {
    return this.deleted != null;
  }
}
