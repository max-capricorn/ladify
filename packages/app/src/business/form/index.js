import {LadifyPageContext} from '@ladify/core'
import {reactive,effect} from '@vue/reactivity';


export default class FormLogic extends LadifyPageContext {
  constructor(){
    super();
    this.s = reactive({ price:12 })

    effect(()=>{
      this.setState('title', "content", "price:"+this.s.price);
      if(this.s.price>15)
      this.setState('btn:warning', 'type','danger');
      else
      this.setState('btn:warning', 'type','default');
    })
  }

  onClick(id,type,payload){
    if(id==="goodway"){ this.s.price++; return true;}
    return false;
  }


  handleEvent(id, type, payload) {
  }
}
