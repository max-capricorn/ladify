import React, { useState, useEffect } from 'react';
import { Layout, Switch, Button, Drawer } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { CloseOutlined } from '@ant-design/icons';
import { WidthProvider, Responsive } from 'react-grid-layout';
import service from './LadifyService';
import { LadifyRegistry } from './LadifyRegistry';
import './Ladify.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const NextFloorToolBar = function (props) {
  const { layers: _l, maxId: _id, layerLevel, setNextData } = props;
  const _w = _l[layerLevel].widgets;
  const _layouts = _l[layerLevel].layouts;
  const [debug, setDebug] = useState(true);
  const [widgets, setWidgets] = useState(() => _w || []);
  const [layouts, setLayouts] = useState({});
  const [isEditorShow, setEditorShow] = useState(false);
  const [script, setScript] = useState('');
  const [layers, setlayers] = useState(() => _l || {});
  const [curResponsive, setCurResponsive] = useState({});
  const [maxId, setMaxId] = useState(() => _id);
  const [editor, setEditor] = useState(null);
  const { logic, closeFloor } = props;
  const { Header, Content } = Layout;
  const [importedWidgets, setImportedWidgets] = useState(
    LadifyRegistry.instance().getAllWidgets()
  );
  useEffect(() => {
    setWidgets(_w);
    setMaxId(_id);
    setlayers(_l);
    setLayouts(_layouts);
  }, [_w, _l]);
  const editorDidMount = async (editor, monoco) => {
    setEditor(editor);
    const code = await service.getcode(props.pageId);
    editor.setValue(code);
  };

  const editorComp = (
    <MonacoEditor
      width="100%"
      height="400"
      language="typescript"
      theme="vs-dark"
      value={script}
      editorDidMount={editorDidMount}
      options={{
        selectOnLineNumbers: true,
        matchBrackets: 'near',
      }}
    />
  );

  const onCloseEditor = () => {
    setEditorShow(false);
  };

  // const saveLayout = () => {
  //   service.saveFloorLayout({layers: layers, widgets: widgets, maxId: maxId},props.pageId);
  // }

  // useEffect(() => {
  //   let getcode = async () => {
  //     let url = 'http://localhost:8081/getFloorLayout?pageId=order';
  //     try {
  //       const response = await fetch(url, {
  //         method: 'GET',
  //         mode: 'cors',
  //         cache: 'no-cache'
  //       });
  //       const content = await response.json();
  //       // setJson(content);
  //       setMaxId(content.MaxId);
  //       setLayouts(content.layouts)
  //       setWidgets(content.widgets)
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  //   getcode();
  // }, [])

  // const clearAll = () => {
  //   setMaxId(1);
  //   setLayouts({})
  //   setWidgets([])
  // }

  const onLayoutChange = (widgets, layouts) => {
    // const { layers,  } = this.state
    props.logic.updateBounds(widgets);
    // this.setState({ layouts });
    layers[props.layerLevel].layouts = layouts;
    // this.setState([
    //   ...layers
    // ]);
    setLayouts(layouts);
    setlayers([...layers]);
  };
  const onBreakpointChange = (newBreakpoint, newCols) => {
    setCurResponsive({
      ...curResponsive,
      breakpoint: newBreakpoint,
      cols: newCols,
    });
  };
  const showDrawer = () => {
    setEditorShow(true);
  };
  const onRemoveItem = (i) => {
    setWidgets(widgets.filter((item, index) => index !== i));
    logic.removeWidget(i);
  };

  const changeId = (e, l) => {
    const oldi = l.i;
    const newi = prompt(`change id ${oldi} to: `, l.i);
    if (!newi) return;
    // check if id 重复
    const duplicatedAry = widgets.filter((w) => w.i === newi);
    if (duplicatedAry.length > 0) {
      alert(`重复的 id ${newi} ，重试`);
      return;
    }
    l.i = newi;

    const keys = Object.keys(layouts);
    keys.forEach((k) => {
      const curLayout = layouts[k];
      const targetW = curLayout.filter((m) => m.i === oldi);
      if (targetW.length > 0) targetW[0].i = l.i;
    });
    // saveLayout();
    // forceUpdate()
  };

  const generateDOM = () => {
    console.log('generateDOM  widgets: ', widgets);
    return (
      widgets &&
      widgets.map((l, i) => {
        console.log('l: ', l);
        if (importedWidgets[l.type]) {
          const h = importedWidgets[l.type].getCellH() || 1;
          const w = importedWidgets[l.type].getCellW() || 4;
          const rdata = { logic, l };
          return (
            <div key={l.i} data-grid={{ x: 0, y: 9999, h, w }}>
              {debug ? (
                <>
                  <span className="myid">
                    <Button onClick={(e) => changeId(e, l)}>{l.i}</Button>
                  </span>
                  <span className="script" onClick={() => showDrawer()}>
                    e
                  </span>
                  <span className="remove" onClick={() => onRemoveItem(i)}>
                    x
                  </span>
                </>
              ) : (
                ''
              )}
              {React.createElement(importedWidgets[l.type], rdata)}
            </div>
          );
        }

        return (
          <div key={l.i} data-grid={l}>
            <span className="remove" onClick={() => onRemoveItem(i)}>
              x
            </span>
          </div>
        );
      })
    );
  };

  const handleChange = () => {
    logic.clearAllWidgets();
    setDebug(!debug);
  };

  return (
    <div
      className="mask"
      style={{
        width: '100%',
        minHeight: '100%',
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 9999,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 0,
      }}
    >
      <div style={{ width: '100%', minHeight: '100%', background: '#fff' }}>
        <Layout>
          <Content>
            <div style={{ background: '#eee', padding: 20, minHeight: 800 }}>
              <ResponsiveReactGridLayout
                className="layouts"
                {...props.grid}
                layouts={layouts}
                useCSSTransforms={false}
                onLayoutChange={(layout, layouts) =>
                  onLayoutChange(layout, layouts)
                }
                onBreakpointChange={(newBreakpoint, newCols) =>
                  onBreakpointChange(newBreakpoint, newCols)
                }
                isDraggable={debug}
                isResizable={debug}
              >
                {generateDOM()}
              </ResponsiveReactGridLayout>
            </div>
          </Content>
          <Drawer
            placement="bottom"
            height={500}
            mask={false}
            closable
            onClose={onCloseEditor}
            destroyOnClose
            visible={isEditorShow}
          >
            <Button
              type="primary"
              style={{ marginRight: '7px' }}
              onClick={(e) =>
                service.saveCode(editor.getModel().getValue(), props.pageId)
              }
            >
              save
            </Button>
            {editorComp}
          </Drawer>
        </Layout>
      </div>
    </div>
  );
};

NextFloorToolBar.defaultProps = {
  grid: {
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 50,
    margin: [0, 0],
    isDraggable: true,
    isResizable: true,
  },
  view: { width: '100%' },
};

export default NextFloorToolBar;
