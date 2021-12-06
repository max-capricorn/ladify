import React from 'react';
import {Button} from 'antd';
import {LadifyWidget} from '@ladify/core'


export default class BtnWidget extends LadifyWidget {
  static getWidgetType() {
    return "Btn";
  }
  static getCellW() {
    return 4;
  }
  static getCellH() {
    return 1;
  }
  constructor(props) {
    super(props)
    this.state = {
      content: props.content || "default btn",
      type:props.type || "primary"
    };
  }
  render() {
    return (<Button type={this.props.type} onDoubleClick={e => this.emitEvent('onDoubleClick', e)} onClick={e => this.emitEvent('onClick', e)} style={{'width': '100%', 'height': '100%', 'padding':'0'}}>{this.props.content}</Button>)
  }
}
