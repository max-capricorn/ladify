
import React from 'react';
import {LadifyWidget} from '@ladify/core'


export default class H1Widget extends LadifyWidget {

  static getWidgetType() {
    return "h1"
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
      content: "h1"
    };
  }
  render() {
    return <h1>{this.state.content}</h1>
  }
}
