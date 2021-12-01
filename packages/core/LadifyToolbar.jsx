import React,{PureComponent} from 'react';
import {Layout, Button, Drawer, Switch} from 'antd';
import {WidthProvider, Responsive} from "react-grid-layout";
import importedWidgets from '@ladify/antd4'
import MonacoEditor from "react-monaco-editor";
import {reactive} from '@vue/reactivity';
import service from './LadifyService'
import './Ladify.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const {Header, Content} = Layout;


export class LadifyToolbar extends PureComponent {
  static defaultProps = {
    grid:{
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
      layouts:props.layoutJson.layouts,
      widgets:props.layoutJson.widgets, 
      isEditorShow: false, 
      debug: true, 
      script: "", 
      cur_responsive:{ breakpoint:'lg' }
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
    let newi  = prompt(`change id ${oldi} to: `, l.i) ;
    if(!newi)return;
    // check if id 重复 
    let duplicatedAry = this.state.widgets.filter(w=>w.i===newi) ;
    if(duplicatedAry.length>0){
      alert('重复的 id '+ newi+" ，重试");
      return;
    }
    l.i = newi
    
    let keys = Object.keys(this.state.layouts);
    keys.forEach(k =>{
      let curLayout = this.state.layouts[k];
      let targetW = curLayout.filter(m => m.i === oldi)
      if(targetW.length>0)
        targetW[0].i = l.i;
    })
    this.saveLayout();
    this.forceUpdate()
  }

  saveLayout(){
    service.saveLayout({layouts: this.state.layouts, widgets: this.state.widgets, maxId: this.maxId},this.props.pageId);
  }

  generateDOM = () => {
    return this.state.widgets.map((l, i) => {
      if (importedWidgets[l.type]) {
        let h = importedWidgets[l.type].getCellH() || 1;
        let w = importedWidgets[l.type].getCellW() || 4;
        let rdata = {logic: this.props.logic, l: l};
        return (
          <div key={l.i} data-grid={{x:0,y:9999,h,w}} >
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

  addElement(type) {
    const addItem = reactive({
      // TODO: 初始位置
      // x: 0,
      // y: 9999,
      i: '' + this.maxId++
    });
    this.setState(
      {
        widgets: this.state.widgets.concat({
          ...addItem,
          type,
        }),
      }
      ,()=>{
        console.log("state",this.state)
      });
    
  };

  onRemoveItem(i) {
    this.setState({
      ... this.state,
      widgets: this.state.widgets.filter((item, index) => index !== i)
    });
    this.props.logic.removeWidget(i)
  }

  onBreakpointChange(newBreakpoint, newCols){
    this.setState({cur_responsive:{breakpoint:newBreakpoint,cols:newCols}})
  }

  onLayoutChange(widgets, layouts) {
    console.log("layouts",layouts)
    this.setState({layouts});
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
      <Layout>
        <Header style={{position: 'fixed', zIndex: 999999, width: '100%', 'padding': '0 30px'}}>
          <span style={{'color': 'white'}}>{this.state.debug ? 'Develop' : 'Preview'}</span> <Switch style={{'marginRight': '7px'}} onChange={e => {this.props.logic.clearAllWidgets(); this.setState({debug: !this.state.debug})}} checked={this.state.debug} />

          {
            this.state.debug ? (
              <>
          <Button type="normal" style={{'marginRight': '7px'}} onClick={e=>this.saveLayout()}>save</Button>
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
          <div style={{background: '#eee', padding: 20, minHeight: 800}}>
            <ResponsiveReactGridLayout
              className="layout"
              {...this.state.grid}
              layouts={this.state.layouts}
              useCSSTransforms={false}
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
          <Button type="primary" style={{'marginRight': '7px'}} onClick={e=>service.saveCode(this.editor.getModel().getValue(),this.props.pageId)} >save</Button>
          {editor}
        </Drawer>
      </Layout>
    )
  }
}
