
const single =  'LadifyRegistrySignleton'

export class LadifyRegistry {
  static instance () {
    if (this[single]) { 
      return this[single]
    }
     this[single] = new this()
    return this[single];
  }

  constructor() {
    const sourceClass = this.constructor;
    if (!sourceClass[single]) { 
      sourceClass[single] = this 
    }
    return sourceClass[single] 
  }

  allWidgets = {}
  registerAll(widgets) {
    this.allWidgets = widgets;
  }
  getAllWidgets() {
    return this.allWidgets;
  }
}
