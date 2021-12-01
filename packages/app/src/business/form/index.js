import {LadifyPageContext} from '@ladify/core'

export default class FormLogic extends LadifyPageContext {
  handleEvent(id, type, payload) {
    if (type === 'onClick') {
        if(id==="goodway"){
            alert('hello goodway');
        }
    }
  }
}
