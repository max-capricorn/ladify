import LadifyWidget from '../ladify/LadifyWidget'


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
