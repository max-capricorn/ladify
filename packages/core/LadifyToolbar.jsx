import React, {PureComponent} from 'react';
import {Layout, Button, Drawer, Switch} from 'antd';
import {WidthProvider, Responsive} from "react-grid-layout";
import importedWidgets from '@ladify/antd3'
import MonacoEditor from "react-monaco-editor";
import {reactive} from '@vue/reactivity';
import service from './LadifyService'
import './Ladify.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const {Header, Content} = Layout;


export class LadifyToolbar extends React.Component {
  static defaultProps = {
    grid: {
      cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
      rowHeight: 50,
      margin: [0, 0],
      isDraggable: true,
      isResizable: true
    }
  };

  constructor(props) {
    super(props);
    this.maxId = props?.layoutJson?.maxId || 1;
    this.editor = null;

    this.state = {
      grid: props.grid,
      layouts: props.layoutJson.layouts,
      widgets: props.layoutJson.widgets,
      isEditorShow: false,
      debug: true,
      script: "",
      selection: {
        enabled: true,
        ing: false,
        firstPoint: {x: 0, y: 0},
      },
      rect: {left: 0, top: 0, width: 0, height: 0},
      cur_responsive: {breakpoint: 'lg'}
    };
  }
  clearAll() {
    this.maxId = 1;
    this.setState({layouts: {}, widgets: []})
  }

  showDrawer = () => {
    this.setState({
      isEditorShow: true,
    });
  };

  changeId = (e, l) => {
    let oldi = l.i
    let newi = prompt(`change id ${oldi} to: `, l.i);
    if (!newi) return;
    // check if id 重复 
    let duplicatedAry = this.state.widgets.filter(w => w.i === newi);
    if (duplicatedAry.length > 0) {
      alert('重复的 id ' + newi + " ，重试");
      return;
    }
    l.i = newi

    let keys = Object.keys(this.state.layouts);
    keys.forEach(k => {
      let curLayout = this.state.layouts[k];
      let targetW = curLayout.filter(m => m.i === oldi)
      if (targetW.length > 0)
        targetW[0].i = l.i;
    })
    this.saveLayout();
    this.forceUpdate()
  }

  saveLayout() {
    service.saveLayout({layouts: this.state.layouts, widgets: this.state.widgets, maxId: this.maxId}, this.props.pageId);
  }

  generateDOM = () => {
    return this.state.widgets.map((l, i) => {
      if (importedWidgets[l.type]) {
        let h = importedWidgets[l.type].getCellH() || 1;
        let w = importedWidgets[l.type].getCellW() || 4;
        let rdata = {logic: this.props.logic, l: l};
        return (
          <div 
          key={l.i} data-grid={{x: 0, y: 9999, h, w}} 
          style={l.selected ? {'outline': '3px dashed red'} : {}}>
            {
              this.state.debug ? (<><span className='myid'>
                <Button onClick={e => this.changeId(e, l)} style={{'height': '20px'}}>{l.i}</Button>
              </span>
                <span className='myevent' onClick={this.showDrawer}>e</span>
                <span className='remove' onClick={this.onRemoveItem.bind(this, i)}>x</span>
              </>) : ""
            }
            {React.createElement(importedWidgets[l.type], rdata)}
          </div>
        )
      }
      else {
        return (
          <div key={l.i} data-grid={l}>
            <span className='remove' onClick={this.onRemoveItem.bind(this, i)}>x</span>
          </div>
        )
      }
    });
  };
  mouseLeave(e) {
    // e.persist()
    //   this.setState(
    //     {
    //       selection:{
    //         ... this.state.selection,
    //         ing:false
    //       }
    //     }
    //   )
  }
  mouseMove(e) {
    if (!this.state.selection.enabled) return;
    if (this.state.selection.ing) {
      let x = e.pageX;
      let y = e.pageY - 64;

      this.setState(
        {
          ing: true,
          rect: {
            left: Math.min(x, this.state.selection.firstPoint.x),
            top: Math.min(y, this.state.selection.firstPoint.y),
            width: Math.abs(x - this.state.selection.firstPoint.x),
            height: Math.abs(y - this.state.selection.firstPoint.y)
          }
        }
      )
      // 1. clear all selected
      this.setState({widgets: this.state.widgets.map(w => {w.selected = false; return w;})})
      // 2 caculate which widgets are selected
      // 2.1 get all the grid cell rect contains 

      // 3 mark widgets selected 

    }
  }
  mouseDown(e) {
    if (!this.state.selection.enabled) return;
    let x = e.pageX;
    let y = e.pageY - 64;

    this.setState(
      {
        selection: {
          ... this.state.selection,
          ing: true,
          firstPoint: {x, y}
        },
        rect: {left: x, top: y, width: 0, height: 0}
      }
    )
  }
  mouseUp(e) {
    if (!this.state.selection.enabled) return;
    this.setState(
      {
        selection: {
          ... this.state.selection,
          ing: false,
          firstPoint: {x: 0, y: 0},
          end: {x: 0, y: 0},
        }
      }
    )
  }

  addElement(type) {
    const addItem = reactive({
      selected: true,
      i: '' + this.maxId++
    });
    this.setState(
      {
        widgets: this.state.widgets.concat({
          ...addItem,
          type,
        }),
      }
      , () => {
        console.log("state", this.state)
      });

  };

  onRemoveItem(i) {
    this.setState({
      ... this.state,
      widgets: this.state.widgets.filter((item, index) => index !== i)
    });
    this.props.logic.removeWidget(i)
  }

  onBreakpointChange(newBreakpoint, newCols) {
    this.setState({cur_responsive: {breakpoint: newBreakpoint, cols: newCols}})
  }

  onLayoutChange(widgets, layouts) {
    this.props.logic.updateBounds(widgets);
    this.setState({layouts});
  }

  onDragStop(layout, oldItem, newItem, placeholder, e, element) {
    console.log(layout, oldItem, newItem, placeholder, e, element)
    // unsync
    this.setState(
      {
        selection: {
          ... this.state.selection,
          enabled: true,
          ing:false
        }
      }
    )
  }
  onDragStart(layout, oldItem, newItem, placeholder, e, element) {
    console.log(layout, oldItem, newItem, placeholder, e, element)
    // make setState sync 
    setTimeout(() => {
      this.setState(
        {
          selection: {
            ... this.state.selection,
            enabled: false,
            ing:false
          }
        }
      )

    }, 0)
  }

  render() {
    let editorDidMount = async (editor, monoco) => {
      this.editor = editor;
      let code = await service.getcode(this.props.pageId)
      editor.setValue(code)
    }

    let editor = (<MonacoEditor
      width="100%"
      height="400"
      language="typescript"
      theme="vs-dark"
      value={this.state.script}
      editorDidMount={editorDidMount}
      options={{
        selectOnLineNumbers: true,
        matchBrackets: "near",
      }}
    />
    );

    let onClose = () => {
      this.setState({
        isEditorShow: false,
      });
    };
    return (
      <Layout onMouseUp={e => this.mouseUp(e)} onMouseMove={e => this.mouseMove(e)}>
        <Header style={{position: 'fixed', zIndex: 999999, width: '100%', 'padding': '0 30px'}}>
          <span style={{'color': 'white'}}>{this.state.debug ? 'Develop' : 'Preview'}</span> <Switch style={{'marginRight': '7px'}} onChange={e => {this.props.logic.clearAllWidgets(); this.setState({debug: !this.state.debug})}} checked={this.state.debug} />

          {
            this.state.debug ? (
              <>
                <Button type="normal" style={{'marginRight': '7px'}} onClick={e => this.saveLayout()}>save</Button>
                <Button type="danger" style={{'marginRight': '60px'}} onClick={this.clearAll.bind(this)}>clearAll</Button>

                {Object.keys(importedWidgets).map((k) => {
                  return (<Button key={k} type="primary" style={{'marginRight': '7px'}} onClick={this.addElement.bind(this, k)}>{k}</Button>)
                }
                )}
              </>
            ) : ''
          }
        </Header>

        <Content style={{marginTop: 44}}>
          <div onMouseLeave={e => {this.mouseLeave(e)}} onMouseDown={e => {this.mouseDown(e)}} onMouseUp={e => {this.mouseUp(e)}} onMouseMove={e => {this.mouseMove(e)}} style={{background: '#eee', padding: 20, minHeight: 800, position: 'relative'}}>
            <ResponsiveReactGridLayout
              className="layout"
              {...this.state.grid}
              layouts={this.state.layouts}
              useCSSTransforms={false}
              onDragStart={(layout, oldItem, newItem, placeholder, e, element) => this.onDragStart(layout, oldItem, newItem, placeholder, e, element)}
              onDragStop={(layout, oldItem, newItem, placeholder, e, element) => this.onDragStop(layout, oldItem, newItem, placeholder, e, element)}
              onResizeStart={(layout, oldItem, newItem, placeholder, e, element) => this.onDragStart(layout, oldItem, newItem, placeholder, e, element)}
              onResizeStop={(layout, oldItem, newItem, placeholder, e, element) => this.onDragStop(layout, oldItem, newItem, placeholder, e, element)}
              onLayoutChange={(layout, layouts) =>
                this.onLayoutChange(layout, layouts)
              }
              onBreakpointChange={(newBreakpoint, newCols) =>
                this.onBreakpointChange(newBreakpoint, newCols)
              }
              isDraggable={this.state.debug}
              isResizable={this.state.debug}
            >
              {this.generateDOM()}
            </ResponsiveReactGridLayout>
            {this.state.selection.ing ? (
              <>
                <div style={{position: 'absolute', top: `${'' + this.state.rect.top + 'px'}`, left: `${'' + this.state.rect.left + 'px'}`, width: `${'' + this.state.rect.width + 'px'}`, height: `${'' + this.state.rect.height + 'px'}`, backgroundColor: 'rgba(0,33,255,0.5)', zIndex: 9999999}}>
                  <div style={{position: 'absolute', top: '-30px', left: 0, height: '30px'}}>
                    {JSON.stringify(this.state.rect)}
                  </div>

                </div>

              </>
            ) : ""}
          </div>
        </Content>
        <Drawer
          placement="bottom"
          height="500"
          mask={false}
          closable={true}
          onClose={onClose}
          destroyOnClose={true}
          visible={this.state.isEditorShow}
        >
          <Button type="primary" style={{'marginRight': '7px'}} onClick={e => service.saveCode(this.editor.getModel().getValue(), this.props.pageId)} >save</Button>
          {editor}
        </Drawer>
      </Layout>
    )
  }
}
