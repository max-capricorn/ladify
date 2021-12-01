
// this file should contains all the business logic 
import {columns, data} from '../../mock/tableData'
import {LadifyPageContext} from '@ladify/core'

export default class OrderLogic extends LadifyPageContext {
  handleEvent(id, type, payload) {
    if (type === 'menu.onClick'){
      switch(id) {
        case "22":
              
          let menus= [];
          if(payload.key === 0)
          {
            menus = [ {
              key: 0,
              type: "user",
              content: "hello 1"
            },
              {
                key: 1,
                type: "user",
                content: "hello 2"
              },
              {
                key: 2,
                type: "user",
                content: "hello 3"
              },
            ]
          }
          else {
            menus = [ {
              key: 0,
              type: "user",
              content: "world 1"
            },
              {
                key: 1,
                type: "user",
                content: "world 2"
              },
              {
                key: 2,
                type: "user",
                content: "world 3"
              },
            ]
          }
          this.setState("23", "menus", menus)
            let  menus2 = [ {
              key: 0,
              type: "user",
              content: "haha 1"
            },
              {
                key: 1,
                type: "user",
                content: "haha 2"
              },
              {
                key: 2,
                type: "user",
                content: "haha 3"
              },
            ]
            this.setState("24", "menus", menus2)
        break;
        default:
          console.warn("not handled evenet")
          break;
      }
    }
    else if (type === 'onClick') {
      switch (id) {
          case 'newid':
          alert('hello,world.this. is good article')
          break;
          case '27':
            alert(this.getState('26', 'value'))
          break;
         case "form_btn":
          let that = this;
          function getDropValue(id){
            let menus =  that.getState(id, 'menus')
            let idx =  that.getState(id, 'selected')
            return  menus[idx]
          }
          alert(JSON.stringify({a:getDropValue('22'),b:getDropValue('23'),c:getDropValue('23')}));
         break;
        case "9":
          const form = [1,2,3,4,5,6,7,8,9].reduce((o,i)=>{ o[i]=this.getState(i, "value"); return o; },{})
          setTimeout(()=>{
            this.setState("10", "columns", columns)
            this.setState("10", "dataSource", data)
            const ndata = [];
            const keys = Object.keys(form);
            for (let i = 0; i < keys.length; i++) {
              ndata.push({
                key: i,
                name: `${keys[i]}`,
                age: 32,
                address: `${form[keys[i]]}`,
              });
            }
            this.setState("10", "dataSource", ndata)
          },1000)
          break;
        default:
          console.error("not handled event")
      }
    }
  }
}
