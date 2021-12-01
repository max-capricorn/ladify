import React from 'react';
import {LadifyWidget} from '@ladify/core'


export default class HelloWidget extends LadifyWidget {
  static getType(){
    return "button"
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
      content: ""
    };
  }
  render() {
    return <input  onChange={e => {this.setState({content:e.target.value}); this.emitEvent('onChange', e)}} style={{'width': '100%', 'height': '100%'}} />
  }
}
