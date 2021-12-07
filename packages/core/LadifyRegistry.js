const single = 'LadifyRegistrySignleton';

export class LadifyRegistry {
  static instance() {
    if (this[single]) {
      return this[single];
    }
    this[single] = new this();
    return this[single];
  }

  constructor() {
    const sourceClass = this.constructor;
    if (!sourceClass[single]) {
      sourceClass[single] = this;
    }
    return sourceClass[single];
  }

  allWidgets = {};

  registerAll(widgets) {
    if (!widgets instanceof Object) {
      console.error('widgets is not object');
      return;
    }
    if (Object.keys(this.allWidgets).length > 0) {
      console.error('allWidgets already registed, do not overwrite!');
      return;
    }
    this.allWidgets = widgets;
  }

  getAllWidgets() {
    return this.allWidgets;
  }
}
