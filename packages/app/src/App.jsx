import * as React from "react";
import { Switch, Route, Link } from "react-router-dom";
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
      <Switch>
        <Route path="/" children={<Order />} />
        <Route path="/form" children={<Form />} />
        <Route path="/home" children={<Home />} />
      </Switch>
    </div>
  );
}
