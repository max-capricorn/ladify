export default class LadifyPageContext {
  constructor() {
    this.widgets = {}
  }
  sendMessage(id, type, payload) {
    let x = this.widgets[id];
    if (x)
      x.onMessage(type, payload);
  }
  getState(id, type) {
    let x = this.widgets[id];
    if (x)
      return x.getSmartState(type);
  }
  setState(id, type, payload) {
    let x = this.widgets[id];
    if (x)
      x.setSmartState(type, payload);
  }
  clearAllWidgets() {
    this.widgets = {}
  }
  removeWidget(id) {
    delete this.widgets[id];
  }
  addWidget(w) {
    let id = w.l.i;
    let w2 = this.widgets[id]
    if (!w2)
      this.widgets[id] = w;
    else 
    {
      console.error("应该在 layoutToolbar  就会去重，但还是发现了重复的 id:"+id);
    }
  }

  handleEvent(id, type, payload) {
    throw new Error("逻辑类未实现。应该由逻辑类自行实现")
  }
}
