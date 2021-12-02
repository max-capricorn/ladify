import React from 'react';
export class LadifyWidget extends React.Component {
  static getCellW(){
    return 1;
  }
  static getCellH(){
    return 1;
  }

  constructor(props) {
    super(props);
    this.logic = props.logic;
    this.l = props.l;
    this.logic.addWidget(this)
  }

  onCellBoundsChanged(newL){
    this.l = newL;
  }

  getBounds(){
    return this.l
  }

  getId() {return this.l.i};
  getName() {throw new Error("请定义一个组件的名字")}

  componentWillUnmount(){
    this.emitEvent('componentWillUnmount', this.getId())
  }
  componentDidMount(){
    this.emitEvent('componentDidMount', this.getId())
  }

  getSmartState(key) {
    if(this.state)
      return key.split('.').reduce((o,i)=> o[i], this.state)
    return null
  }

  setSmartState(key, val) {
     this.setState({[key]: val})
  }

  emitEvent(type, payload) {
    if(this.logic[type] && !this.logic[type](this.getId(), type, payload))
      this.logic.handleEvent(this.getId(), type, payload);
  }
}
