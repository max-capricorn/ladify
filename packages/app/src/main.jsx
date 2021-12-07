import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { enableMapSet } from 'immer';

import './index.css';
import importedWidgets from '@ladify/antd4';
import { LadifyRegistry } from '@ladify/core';

import App from './App';

enableMapSet();
console.log('importedWidgets: ', importedWidgets);
LadifyRegistry.instance().registerAll(importedWidgets);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
