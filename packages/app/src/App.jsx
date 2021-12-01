import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Order from './pages/order';
import Home from './pages/home';
import Form from './pages/form';
import "./App.css";
export default function App() {
  return (
    <div className="App">
      <nav>
        <Link style={{'marginRight': '7px'}}  to="/">order</Link>
        <Link style={{'marginRight': '7px'}}  to="/form">form</Link>
        <Link to="/home">home</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Order />} />
        <Route path="/form" element={<Form />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}
