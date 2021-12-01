import {LadifyWidget} from '@ladify/core'


export default class BlankWidget extends LadifyWidget {
  static getCellW() {
    return 4;
  }
  static getCellH() {
    return 1;
  }

  render() {
    return ""
  }
}
