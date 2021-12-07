import { LadifyPageContext } from '@ladify/core';

export default class PageLogic extends LadifyPageContext {
  handleEvent(id, type, payload) {
    console.log('id, type, payload: ', id, type, payload);
  }
}
