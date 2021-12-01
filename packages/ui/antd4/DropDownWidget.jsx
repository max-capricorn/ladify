import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import {HomeOutlined} from '@ant-design/icons'
import {LadifyWidget} from '@ladify/core'

export default class DropDownWidget extends LadifyWidget {
  static getType() {
    return "dropdown"
  }
  static getCellW() {
    return 1;
  }
  static getCellH() {
    return 1;
  }

  constructor(props) {
    super(props)
    this.state = {
      selected:0,
      menus: [
        {
          key: 0,
          type: "user",
          content: "hello" },
        {
          key: 1,
          type: "user",
          content: "world"
        },
      ]
    };
  }
  render() {
    const menus =
      (
        <Menu onClick={e=>{this.setState({selected:e.key});  this.emitEvent('menu.onClick', e)}}>
          {
            this.state.menus.map(m => {
              return (<Menu.Item key={m.key}>
                <HomeOutlined type={m.type} />
                {m.content}
              </Menu.Item>)
            })
          }
        </Menu>
      )
    return (
      <Dropdown overlay={menus} >
        <Button style={{"width":"100%", 'height':'100%'}}>
          {this.state.menus[this.state.selected].content} <HomeOutlined />
        </Button>
      </Dropdown>

    )
  }
}
