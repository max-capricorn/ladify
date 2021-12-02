import {LadifyPageContext} from '@ladify/core'
import {reactive,effect} from '@vue/reactivity';


export default class FormLogic extends LadifyPageContext {
  constructor(){
    super();

    this.businessData = reactive({
      price:12,
      name:'hello'
    })

    effect(()=>{this.setState('title', "content", this.businessData.price); })
  }
  onClick(id,type,payload){
    if(id==="goodway"){
      this.businessData.price++;
    }
  }
  handleEvent(id, type, payload) {
    if (type === 'onClick') {
      this.onClick(id, type, payload)
    }
  }
}
