import React from 'react';
import {Input} from 'antd';
import {LadifyWidget} from '@ladify/core'

export default class InputWidget extends LadifyWidget {
  static getCellW() {
    return 4;
  }
  static getCellH() {
    return 1;
  }
  constructor(props) {
    super(props)
    this.state = {
      holder: "place holder ..",
      value:"..."
    };
  }

  render() {
    return (
      <Input placeholder={this.state.holder} onChange={e => (this.setState({'value': e.target.value}))} style={{'width': '100%', 'height': '100%'}} />
    )
  }
}
