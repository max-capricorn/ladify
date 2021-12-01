import React from 'react';
import { effect } from '@vue/reactivity';
export class LadifyWidget extends React.Component {

  constructor(props) {
    super(props);
    this.logic = props.logic;
    this.l = props.l;
    this.logic.addWidget(this)
    effect(()=>{
        console.log('l: ', props.l);
    })
  }

  static getCellW(){
    return null;
  }
  static getCellH(){
    return null;
  }

  getId() {return this.l.i};
  getName() {throw new Error("请定义一个组件的名字")}

  componentWillUnmount(){
    this.emitEvent('componentWillUnmount', this.getId())
  }
  componentDidMount(){
    this.emitEvent('componentDidMount', this.getId())
  }
  componentWillMount(){
    this.emitEvent('componentWillMount', this.getId())
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
    this.logic.handleEvent(this.getId(), type, payload);
  }
}
