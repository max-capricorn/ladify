
import React from 'react';
import {LadifyWidget} from '@ladify/core'

const data = {
  nodes: [
    {
      id: '0',
      label: 'Node',
      x: 55,
      y: 55,
    },
    {
      id: '1',
      label: 'Node',
      x: 55,
      y: 255,
    },
  ],
  edges: [
    {
      label: 'Label',
      source: '0',
      target: '1',
    },
  ],
};

export default class WorkFlowWidget extends LadifyWidget {
  static getCellW(){
    return 12;
  }
  static getCellH(){
    return 6;
  }
  constructor(props) {
    super(props)
    this.state = {
      content: " "
    };
  }

  render() {
    return ('')
  }
}
