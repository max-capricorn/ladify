import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Order from './pages/order';
import Home from './pages/home';
import Form from './pages/form';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <div
        style={{
          position: 'fixed',
          zIndex: 999999,
          width: '100%',
          backgroundColor: 'rgba(245,255,0,0.5)',
        }}
      >
        <nav>
          <Link style={{ marginRight: '7px' }} to="/">
            order
          </Link>
          <Link style={{ marginRight: '7px' }} to="/form">
            form
          </Link>
          <Link to="/home">home</Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Order />} />
        <Route path="/form" element={<Form />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}
