import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import importedWidgets from '@ladify/antd4'
import {LadifyRegistry} from '@ladify/core'
LadifyRegistry.instance().registerAll(importedWidgets)

import App from './App'

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)
