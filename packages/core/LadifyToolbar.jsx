import React from 'react';
import {Layout, Button, Drawer, Switch} from 'antd';
import {WidthProvider, Responsive} from "react-grid-layout";
import {LadifyRegistry}  from './LadifyRegistry'
import MonacoEditor from "react-monaco-editor";
import service from './LadifyService'
import './Ladify.css';
import produce from "immer"



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
    },
    view: { width: '100%' }
  };

  constructor(props) {
    super(props);
    this.importedWidgets = LadifyRegistry.instance().getAllWidgets()

    this.maxId = props?.layoutJson?.maxId || 1;
    this.containerRef = React.createRef();
    this.editor = null;
    // 记录当前画面上widgets 的像素坐标
    this.cur_widgets_cords = []
    // 记录当鼠标点击时，是否为 widget 的区域
    this.first_click_on_widget = false;
    // 当前响应式布局
    this.cur_responsive= {breakpoint: 'lg', cols: 12}
    // grid 的 padding
    this.gridPadding= 0



    this.state = {
      layouts: props.layoutJson.layouts,
      widgets: props.layoutJson.widgets,
      isEditorShow: false,
      debug: !this.props.prod,
      script: "",
      selection: {
        ing: false,
        firstPoint: {x: 0, y: 0},
      },
      rect: {left: 0, top: 0, width: 0, height: 0},
    };

  }
  componentDidMount(){
    this.updateWidgetsCord(this.state.layouts)
  }
  clearAll() {this.maxId = 1; this.setState({layouts: {}, widgets: []})}

  showDrawer = () => {this.setState({isEditorShow: true, });};

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

    this.setState( produce( draft=>{ 
      Object.keys(draft.layouts).forEach(k => {
        let targetW = draft.layouts[k].filter(m => m.i === oldi)
        if (targetW.length > 0) targetW[0].i = newi;
      })
      draft.widgets.filter(m=>m.i === oldi)[0].i=newi  
    }))

    this.saveLayout();
  }

  ////  debug ////////////////////////
  componentDidUpdate(prevProps, prevState) {

    Object.entries(this.props).forEach(([key, val]) =>
      prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    );
    if (this.state) {
      Object.entries(this.state).forEach(([key, val]) =>
        prevState[key] !== val && console.log(`State '${key}' changed`,prevState[key],val)
      );
    }
  }
  ////  debug ////////////////////////

   saveLayout() {  service.saveLayout({layouts: this.state.layouts, widgets: this.state.widgets, maxId: this.maxId}, this.props.pageId);}

  generateDOM = () => {
    return this.state.widgets.map((l, i) => {
      if (this.importedWidgets[l.type]) {
        let h = this.importedWidgets[l.type].getCellH() || 1;
        let w = this.importedWidgets[l.type].getCellW() || 4;
        let rdata = {logic: this.props.logic, l: l};
        return (
          <div
            key={l.i}  data-grid={{x: 0, y: 9999, h, w}}
            style={l.selected ? {'outline': '1px dashed red'} : {}}>
            {
              this.state.debug ? (<div><span className='myid'>
                <Button onClick={e => this.changeId(e, l)} style={{'height': '20px'}}>{l.i}</Button>
              </span>
                <span className='script' onClick={this.showDrawer}>e</span>
                <span className='remove' onClick={this.onRemoveItem.bind(this, i)}>x</span>
              </div>) : ""
            }
            {React.createElement(this.importedWidgets[l.type], rdata)}
          </div>
        )
      }
      else {
        return (
          <div style={this.state.debug?{'backgroundColor': 'rgba(244,244,244,1)'}:{}} key={l.i} data-grid={l}>
            <span className='remove' onClick={this.onRemoveItem.bind(this, i)}>x</span>
          </div>
        )
      }
    });
  };

  getRelativeXY(e) {
    let {offsetLeft: l, offsetTop: t, offsetWidth: w, offsetHeight: h} = this.containerRef.current
    return {x:e.pageX - l,y:e.pageY - t}
  }
// check if point in boundingbox 
  isPointInBB(p,bb){
      return  p.x >= bb.x && p.x <= bb.x+bb.w &&p.y >=bb.y && p.y <= bb.y+bb.h
  }

  markWidgets() {
    // TODO: speed up this method
    const gridWitdth = this.containerRef.current.clientWidth - this.gridPadding * 2;
    const colWidth = Math.floor(gridWitdth / this.cur_responsive.cols);
    const layoutedWidgets = this.state.layouts[this.cur_responsive.breakpoint];
    layoutedWidgets.map((item) => {

      const widgetX = Math.floor(item.x * colWidth);
      const widgetY = item.y * this.props.grid.rowHeight;
      const widgetWidth = Math.floor(item.w * colWidth);
      const widgetHeight = item.h * this.props.grid.rowHeight;

      const wcenter = {x:widgetX+widgetWidth/2,y:widgetY+widgetHeight/2}
      const {top: y, left: x, width: w, height: h} = this.state.rect

      // expand the boundingbox, only need to check the center point
      const bigBounding = {x:x-widgetWidth/2,y:y-widgetHeight/2,w:w+widgetWidth,h:h+widgetHeight}
      if (this.isPointInBB(wcenter, bigBounding)) {
        let newWidgets = this.state.widgets.map(w => {if (w.i === item.i) {w.selected = true;} return w;})
        this.setState({widgets: newWidgets})
      }

    });
  }

  mouseMove(e) {
    if(this.first_click_on_widget)return;
    if (this.state.selection.ing) {
      let {x,y}=this.getRelativeXY(e)
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
      //   get all the grid cell rect contains 
      //   mark widgets selected 
      this.markWidgets();

    }
  }
  mouseDown(e) {

    // check if mouse on widgets
    let p =this.getRelativeXY(e)
    let results = this.cur_widgets_cords.filter(w =>{ return  this.isPointInBB(p, w)  })
    if(results.length>0){
      this.first_click_on_widget=true;
      return;
    }
    this.first_click_on_widget=false;

    let {x,y}=this.getRelativeXY(e)
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
    if(this.first_click_on_widget)return;
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

    // TODO: using reactive to connect rdata
    const addItem = {
      selected: true,
      i: '' + this.maxId++
    };
    this.setState(
      {
        widgets: this.state.widgets.concat({
          ...addItem,
          type,
        }),
      }
    );

  };

  onRemoveItem(i) {
    this.setState({
      ... this.state,
      widgets: this.state.widgets.filter((item, index) => index !== i)
    });
    this.props.logic.removeWidget(i)
  }

  onBreakpointChange(newBreakpoint, newCols) {
    this.cur_responsive= {breakpoint: newBreakpoint, cols: newCols}
  }

  cord_grid2px(cell){
    const gridWitdth = this.containerRef.current.clientWidth - this.gridPadding * 2;
    const colWidth = gridWitdth / this.cur_responsive.cols;
    const x = cell.x * colWidth;
    const y = cell.y * this.props.grid.rowHeight;
    const w = cell.w * colWidth;
    const h = cell.h * this.props.grid.rowHeight;
    return {x,y,w,h};
  }

  cord_px2grid(item){
    const gridWitdth = this.containerRef.current.clientWidth - this.gridPadding * 2;
    const colWidth = gridWitdth / this.cur_responsive.cols;
    const x  =item.x / colWidth;
    const y = item.y / this.props.grid.rowHeight;
    const w = item.w / colWidth;
    const h = item.h / this.props.grid.rowHeight;
    return {x,y,w,h};
  }

  updateWidgetsCord(layouts){
    const layoutedWidgets = layouts[this.cur_responsive.breakpoint];
    this.cur_widgets_cords=[]
    layoutedWidgets.map((cell) => {
      let item =this.cord_grid2px(cell)
      this.cur_widgets_cords.push({...item,i:cell.i});
    });
  }
  onLayoutChange(widgets, layouts) {
    this.props.logic.updateBounds(widgets);
    this.setState({layouts},()=>{
      this.updateWidgetsCord(this.state.layouts);
    });

  }

  render() {
    const editorDidMount = async (editor, monoco) => {
      this.editor = editor;
      let code = await service.getcode(this.props.pageId)
      editor.setValue(code)
    }

    const toggglePreview = ()=>{
      // this.props.logic.clearAllWidgets();
      this.setState({debug: !this.state.debug})
    }

    return (
      <Layout onMouseUp={this.mouseUp.bind(this)} onMouseMove={this.mouseMove.bind(this)}>
        <Content style={{marginTop: 44,marginBottom: 100}}>
          <div ref={this.containerRef} onMouseDown={this.mouseDown.bind(this)} onMouseUp={this.mouseUp.bind(this)} onMouseMove={this.mouseMove.bind(this)} style={{border: !this.props.prod?'1px solid red':'',background: '#eee', padding: this.gridPadding,width:this.props.view.width, margin:'0 auto', minHeight: 800, position: 'relative'}}>
            <ResponsiveReactGridLayout
              className="layout"
              {...this.props.grid}
              layouts={this.state.layouts}
              useCSSTransforms={false}
              onLayoutChange={this.onLayoutChange.bind(this)}
              onBreakpointChange={this.onBreakpointChange.bind(this)}
              isDraggable={this.state.debug}
              isResizable={this.state.debug}
            >

              {this.generateDOM()}

            </ResponsiveReactGridLayout>

            {this.state.selection.ing ? (
              <div style={{
                position: 'absolute',
                top: `${'' + this.state.rect.top + 'px'}`,
                left: `${'' + this.state.rect.left + 'px'}`,
                width: `${'' + this.state.rect.width + 'px'}`,
                height: `${'' + this.state.rect.height + 'px'}`,
                backgroundColor: 'rgba(0,33,255,0.5)', zIndex: 9999999
              }}>
                <div style={{position: 'absolute', top: '-30px', left: 0, height: '30px'}}>
                  {JSON.stringify(this.state.rect)}
                </div>
              </div>
            ) : <></>}
          </div>
        </Content>
        <Drawer
          placement="bottom"
          height="500"
          mask={false}
          closable={true}
          onClose={ () => { this.setState({ isEditorShow: false }); }}
          destroyOnClose={true}
          visible={this.state.isEditorShow}
        >
          <Button type="primary" style={{'marginRight': '7px'}} onClick={e => service.saveCode(this.editor.getModel().getValue(), this.props.pageId)} >save</Button>

          <MonacoEditor
            width          = "100%"
            height         = "400"
            language       = "typescript"
            theme          = "vs-dark"
            value          = {this.state.script}
            editorDidMount = {editorDidMount}
            options        = {{
              selectOnLineNumbers: true,
              matchBrackets: "near",
            }}
          />

        </Drawer>
        {
          !this.props.prod ?( <Header style={{position: 'fixed', zIndex: 999999, width: '100%','bottom':'0', 'padding': '0 30px'}}>
            <span style={{'color': 'white'}}>{this.state.debug ? 'Develop' : 'Preview'}</span> 
            <Switch style={{'marginRight': '7px'}} onChange={toggglePreview} checked={this.state.debug} />

            {
            this.state.debug ? (
            <>
            <Button type="normal" style={{'marginRight': '7px'}} onClick={this.saveLayout.bind(this)}>save</Button>
            <Button type="danger" style={{'marginRight': '60px'}} onClick={this.clearAll.bind(this)}>clearAll</Button>

            {Object.keys(this.importedWidgets).map((k) => {
            return (<Button key={k} type="primary" style={{'marginRight': '7px'}} onClick={this.addElement.bind(this, k)}>{k}</Button>)
            }
            )}
        </>
        ) : ''
        }
  </Header> ) :<></>
}
      </Layout>
    )
  }
}
