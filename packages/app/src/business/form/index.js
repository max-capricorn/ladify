
// this file should contains all the business logic 
import LadifyPageContext from '../../ladify/LadifyPageContext'

export default class FormLogic extends LadifyPageContext {
  handleEvent(id, type, payload) {
    if (type === 'onClick') {
        if(id==="goodway"){
            alert('hello goodway');
        }
    }
  }
}
