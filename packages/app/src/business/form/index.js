import {LadifyPageContext} from '@ladify/core'
import {reactive,effect} from '@vue/reactivity';


export default class FormLogic extends LadifyPageContext {
  constructor(){
    super();
    this.s = reactive({ price:12 })

    effect(() => {
      this.setState('title', "content", "price:"+this.s.price);
      if(this.s.price>15)
        this.setState('btn:warning', 'type','danger');
      else
        this.setState('btn:warning', 'type','default');
    })
  }

  componentDidMount(id){
    this.setState('btn:warning', 'type','default');
    if(id==="btn:plus"){ this.setState(id, 'content', 'plus'); return true;}
    if(id==="btn:minus"){ this.setState(id, 'content', 'minus'); return true;}
  }


  onClick(id,type,payload){
    if(id==="btn:plus"){ this.s.price++; return true;}
    if(id==="btn:minus"){ this.s.price--; return true;}
    return false;
  }


  handleEvent(id, type, payload) {
  }
}
