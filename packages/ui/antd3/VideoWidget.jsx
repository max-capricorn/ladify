import React from 'react';
import {LadifyWidget} from '@ladify/core'

export default class Videodget extends LadifyWidget {
  static getCellW() {
    return 4;
  }
  static getCellH() {
    return 5;
  }
  constructor(props) {
    super(props)
    this.state = {
      value: "place holder .."
    };
  }

  render() {
    return (
      <video style={{'width': '100%', 'height': '100%'}} controls >
        <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm" />
      </video>

    )
  }
}
