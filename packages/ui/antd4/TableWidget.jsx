import {Table} from 'antd';
import React from 'react';
import {LadifyWidget} from '@ladify/core'



const columns = [
  {
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
    width: 150,
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
    width: 150,
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
    width: 150,
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
    width: 150,
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
    width: 150,
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
    width: 150,
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
    width: 150,
  },
  { title: 'Column 8', dataIndex: 'address', key: '8' },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => <a>action</a>,
  },
];

const data = [];
for (let i = 0; i < 3; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

export default class TableWidget extends LadifyWidget {
  static getWidgetType() {
    return "Table"
  }
  static getCellW(){
    return 4;
  }
  static getCellH(){
    return 6;
  }
  constructor(props) {
    super(props)
    this.state = {
      columns:columns,
      dataSource:data,
      y: 300
    }
  }
  onCellBoundsChanged(w){
    super.onCellBoundsChanged(w);
    this.setState({y:w.h*50-114})
    this.forceUpdate()
  }

  onMessage(type,payload){
    super.onMessage(type,payload)
  }

  render() {
    return (
      <Table style={{'width': '100%', 'height': '100%'}} columns={this.state.columns} dataSource={this.state.dataSource} scroll={{x: 1500, y: this.state.y}} />

    )
  }
}
