// this file should contains all the business logic
import { LadifyPageContext } from '@ladify/core';
import { columns, data } from '../../mock/tableData';

let timer = null;
export default class HomeLogic extends LadifyPageContext {
  componentDidMount(id, type, payload) {
    if (id === 'btn:ok') {
      this.setState('btn:ok', 'content', 'OK');
      return true;
    }
    if (id === 'btn:cancel') {
      this.setState('btn:cancel', 'content', 'cancel');
      this.setState('btn:cancel', 'type', 'danger');
      return true;
    }
    if (id === 'table:main') {
      this.setState('table:main', 'dataSource', data);
      this.setState('table:main', 'columns', columns);
      return true;
    }

    if (id === '1') {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      timer = setInterval(() => {
        this.setState('1', 'content', `${Math.random() * 100}`);
      }, 1000);
      return true;
    }

    return false;
  }

  onClick(id, type, payload) {
    if (id === '1') {
      const v = this.getState('2', 'value');
      this.setState('3', 'value', v);
    }
    return true;
  }

  handleEvent(id, type, payload) {
    console.log('id, type, payload: ', id, type, payload);
  }
}
