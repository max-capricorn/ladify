import React from 'react';
import {Input} from 'antd';
import {LadifyWidget} from '@ladify/core'

export default class InputWidget extends LadifyWidget {
  static getWidgetType() {
    return "Input"
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
      value: "place holder .."
    };
  }

  render() {
    return (
      <Input placeholder={this.state.value} onChange={e => (this.setState({'value': e.target.value}))} style={{'width': '100%', 'height': '100%'}} />
    )
  }
}
