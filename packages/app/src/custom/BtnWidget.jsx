import React from 'react';
import {Button} from 'antd';
import LadifyWidget from '../ladify/LadifyWidget'


export default class BtnWidget extends LadifyWidget {
  static getCellW() {
    return 4;
  }
  static getCellH() {
    return 1;
  }
  constructor(props) {
    super(props)
    this.state = {
      content: "default btn",
      type:"primary"
    };
  }
  render() {
    return (<Button type={this.state.type} onDoubleClick={e => this.emitEvent('onDoubleClick', e)} onClick={e => this.emitEvent('onClick', e)} style={{'width': '100%', 'height': '100%', 'padding':'0'}}>{this.state.content}</Button>)
  }
}
