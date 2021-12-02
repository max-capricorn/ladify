import React from "react";
import { Layout, Button, Drawer, Switch } from "antd";
import { WidthProvider, Responsive } from "react-grid-layout";
import { LadifyRegistry } from "./LadifyRegistry";
import MonacoEditor from "react-monaco-editor";
import service from "./LadifyService";
import "./Ladify.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const { Header, Content } = Layout;

export class LadifyToolbar extends React.Component {
  static defaultProps = {
    grid: {
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      rowHeight: 50,
      margin: [0, 0],
      isDraggable: true,
      isResizable: true,
    },
    view: { width: "100%" },
  };

  constructor(props) {
    super(props);
    this.importedWidgets = LadifyRegistry.instance().getAllWidgets();

    this.maxId = props?.layoutJson?.maxId || 1;
    this.containerRef = React.createRef();
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
        firstPoint: { x: 0, y: 0 },
      },
      rect: { left: 0, top: 0, width: 0, height: 0 },
      cur_responsive: { breakpoint: "lg", cols: 12 },
      // grid 的内边距
      gridPadding: 0,
      // 保存选中的组件
      saveSelectionWidgets: [],
    };
  }
  clearAll() {
    this.maxId = 1;
    this.setState({ layouts: {}, widgets: [] });
  }

  showDrawer = () => {
    this.setState({ isEditorShow: true });
  };

  changeId = (e, l) => {
    let oldi = l.i;
    let newi = prompt(`change id ${oldi} to: `, l.i);
    if (!newi) return;
    // check if id 重复
    let duplicatedAry = this.state.widgets.filter((w) => w.i === newi);
    if (duplicatedAry.length > 0) {
      alert("重复的 id " + newi + " ，重试");
      return;
    }
    l.i = newi;

    let keys = Object.keys(this.state.layouts);
    keys.forEach((k) => {
      let curLayout = this.state.layouts[k];
      let targetW = curLayout.filter((m) => m.i === oldi);
      if (targetW.length > 0) targetW[0].i = l.i;
    });
    this.saveLayout();
    this.forceUpdate();
  };

  saveLayout() {
    service.saveLayout(
      {
        layouts: this.state.layouts,
        widgets: this.state.widgets,
        maxId: this.maxId,
      },
      this.props.pageId
    );
  }

  generateDOM = () => {
    return this.state.widgets.map((l, i) => {
      if (this.importedWidgets[l.type]) {
        let h = this.importedWidgets[l.type].getCellH() || 1;
        let w = this.importedWidgets[l.type].getCellW() || 4;
        let rdata = { logic: this.props.logic, l: l };
        return (
          <div
            key={l.i}
            data-grid={{ x: 0, y: 9999, h, w }}
            style={l.selected ? { outline: "1px dashed red" } : {}}
          >
            {this.state.debug ? (
              <>
                <span className="myid">
                  <Button
                    onClick={(e) => this.changeId(e, l)}
                    style={{ height: "20px" }}
                  >
                    {l.i}
                  </Button>
                </span>
                <span className="script" onClick={this.showDrawer}>
                  e
                </span>
                <span
                  className="remove"
                  onClick={this.onRemoveItem.bind(this, i)}
                >
                  x
                </span>
              </>
            ) : (
              ""
            )}
            {React.createElement(this.importedWidgets[l.type], rdata)}
          </div>
        );
      } else {
        return (
          <div
            style={
              this.state.debug ? { backgroundColor: "rgba(244,244,244,1)" } : {}
            }
            key={l.i}
            data-grid={l}
          >
            <span className="remove" onClick={this.onRemoveItem.bind(this, i)}>
              x
            </span>
          </div>
        );
      }
    });
  };

  getRelativeXY(e) {
    let {
      offsetLeft: l,
      offsetTop: t,
      offsetWidth: w,
      offsetHeight: h,
    } = this.containerRef.current;
    // console.log(this.containerRef, l, t, w, h)
    // var rect = e.target.getBoundingClientRect();
    // var x = e.clientX - rect.left; //x position within the element.
    // var y = e.clientY - rect.top;  //y position within the element.
    // console.log("rect", rect);
    // console.log("Left? : " + x + " ; Top? : " + y + ".");
    return { x: e.pageX - l, y: e.pageY - t };
  }

  markWidgets() {
    const gridWitdth =
      this.containerRef.current.clientWidth - this.state.gridPadding * 2;
    const colWidth = Math.floor(gridWitdth / this.state.cur_responsive.cols);
    const layoutedWidgets =
      this.state.layouts[this.state.cur_responsive.breakpoint];

    layoutedWidgets.map((item) => {
      const widgetX = Math.floor(item.x * colWidth);
      const widgetY = item.y * this.state.grid.rowHeight;
      const widgetWidth = Math.floor(item.w * colWidth);
      const widgetHeight = item.h * this.state.grid.rowHeight;

      const { top: rt, left: rl, width: rw, height: rh } = this.state.rect;

      const leftFlag = rl <= widgetX;
      const rightFlag = rl + rw >= widgetWidth + widgetX;
      const topFlag = rt <= widgetY;
      const bottomFlag = widgetHeight + widgetY <= rt + rh;

      if (leftFlag && rightFlag && topFlag && bottomFlag) {
        let newWidgets = this.state.widgets.map((w) => {
          if (w.i === item.i) {
            w.selected = true;
          }
          return w;
        });

        this.setState({
          widgets: newWidgets,
          // 保存选中的小部件,做删除和撤销使用
          saveSelectionWidgets: newWidgets,
        });
      }
    });
  }

  mouseMove(e) {
    if (!this.state.selection.enabled) return;
    if (this.state.selection.ing) {
      let { x, y } = this.getRelativeXY(e);
      this.setState({
        ing: true,
        rect: {
          left: Math.min(x, this.state.selection.firstPoint.x),
          top: Math.min(y, this.state.selection.firstPoint.y),
          width: Math.abs(x - this.state.selection.firstPoint.x),
          height: Math.abs(y - this.state.selection.firstPoint.y),
        },
      });
      // 1. clear all selected
      this.setState({
        widgets: this.state.widgets.map((w) => {
          w.selected = false;
          return w;
        }),
      });

      // 2 caculate which widgets are selected
      //   get all the grid cell rect contains
      //   mark widgets selected
      this.markWidgets();
    }
  }
  mouseDown(e) {
    if (!this.state.selection.enabled) return;
    let { x, y } = this.getRelativeXY(e);
    this.setState({
      selection: {
        ...this.state.selection,
        ing: true,
        firstPoint: { x, y },
      },
      rect: { left: x, top: y, width: 0, height: 0 },
    });
  }

  mouseUp(e) {
    if (!this.state.selection.enabled) return;
    this.setState({
      selection: {
        ...this.state.selection,
        ing: false,
        firstPoint: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      },
    });
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  // 删除选中元素
  handleKeyDown = (event) => {
    if (event.keyCode == 8) {
      let removeElementList = this.state.widgets.filter((item) => {
        return item.selected;
      });

      for (let i = 0; i < removeElementList.length; i++) {
        this.state.widgets.map((item, index) => {
          if (removeElementList[i].i == item.i) {
            this.state.widgets.splice(index, 1);
          }
        });
      }
      this.setState(() => ({
        widgets: [...this.state.widgets],
      }));
    }
  };

  addElement(type) {
    // TODO: using reactive to connect rdata
    const addItem = {
      selected: true,
      i: "" + this.maxId++,
    };
    this.setState({
      widgets: this.state.widgets.concat({
        ...addItem,
        type,
      }),
    });
  }

  onRemoveItem(i) {
    this.setState({
      ...this.state,
      widgets: this.state.widgets.filter((item, index) => index !== i),
    });
    this.props.logic.removeWidget(i);
  }

  onBreakpointChange(newBreakpoint, newCols) {
    this.setState({
      cur_responsive: { breakpoint: newBreakpoint, cols: newCols },
    });
  }

  onLayoutChange(widgets, layouts) {
    this.props.logic.updateBounds(widgets);
    this.setState({ layouts });
  }

  onDragStop() {
    // unsync
    this.setState({
      selection: {
        ...this.state.selection,
        enabled: true,
        ing: false,
      },
    });
  }
  onDragStart() {
    // make setState sync
    setTimeout(() => {
      this.setState({
        selection: {
          ...this.state.selection,
          enabled: false,
          ing: false,
        },
      });
    }, 0);
  }

  render() {
    const editorDidMount = async (editor, monoco) => {
      this.editor = editor;
      let code = await service.getcode(this.props.pageId);
      editor.setValue(code);
    };

    return (
      <Layout
        onMouseUp={(e) => this.mouseUp(e)}
        onMouseMove={(e) => this.mouseMove(e)}
      >
        <Content style={{ marginTop: 44, marginBottom: 100 }}>
          <div
            ref={this.containerRef}
            onMouseDown={(e) => {
              this.mouseDown(e);
            }}
            onMouseUp={(e) => {
              this.mouseUp(e);
            }}
            onMouseMove={(e) => {
              this.mouseMove(e);
            }}
            style={{
              border: "1px solid red",
              background: "#eee",
              padding: this.state.gridPadding,
              width: this.props.view.width,
              margin: "0 auto",
              minHeight: 800,
              position: "relative",
            }}
          >
            <ResponsiveReactGridLayout
              className="layout"
              {...this.state.grid}
              layouts={this.state.layouts}
              useCSSTransforms={false}
              onDragStart={() => this.onDragStart()}
              onDragStop={() => this.onDragStop()}
              onResizeStart={() => this.onDragStart()}
              onResizeStop={() => this.onDragStop()}
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
              <div
                style={{
                  position: "absolute",
                  top: `${"" + this.state.rect.top + "px"}`,
                  left: `${"" + this.state.rect.left + "px"}`,
                  width: `${"" + this.state.rect.width + "px"}`,
                  height: `${"" + this.state.rect.height + "px"}`,
                  backgroundColor: "rgba(0,33,255,0.5)",
                  zIndex: 9999999,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-30px",
                    left: 0,
                    height: "30px",
                  }}
                >
                  {JSON.stringify(this.state.rect)}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </Content>
        <Drawer
          placement="bottom"
          height="500"
          mask={false}
          closable={true}
          onClose={() => {
            this.setState({ isEditorShow: false });
          }}
          destroyOnClose={true}
          visible={this.state.isEditorShow}
        >
          <Button
            type="primary"
            style={{ marginRight: "7px" }}
            onClick={(e) =>
              service.saveCode(
                this.editor.getModel().getValue(),
                this.props.pageId
              )
            }
          >
            save
          </Button>

          <MonacoEditor
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
        </Drawer>
        <Header
          style={{
            position: "fixed",
            zIndex: 999999,
            width: "100%",
            bottom: "0",
            padding: "0 30px",
          }}
        >
          <span style={{ color: "white" }}>
            {this.state.debug ? "Develop" : "Preview"}
          </span>
          <Switch
            style={{ marginRight: "7px" }}
            onChange={() => {
              this.props.logic.clearAllWidgets();
              this.setState({ debug: !this.state.debug });
            }}
            checked={this.state.debug}
          />

          {this.state.debug ? (
            <>
              <Button
                type="normal"
                style={{ marginRight: "7px" }}
                onClick={(e) => this.saveLayout()}
              >
                save
              </Button>
              <Button
                type="danger"
                style={{ marginRight: "60px" }}
                onClick={this.clearAll.bind(this)}
              >
                clearAll
              </Button>

              {Object.keys(this.importedWidgets).map((k) => {
                return (
                  <Button
                    key={k}
                    type="primary"
                    style={{ marginRight: "7px" }}
                    onClick={this.addElement.bind(this, k)}
                  >
                    {k}
                  </Button>
                );
              })}
            </>
          ) : (
            ""
          )}
        </Header>
      </Layout>
    );
  }
}
