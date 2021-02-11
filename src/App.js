import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { LoginView } from "./Views/LoginView"
import { DashboardView } from "./Views/DashboardView"
import { getUser } from './API/api'
import './App.css';

export function App() {
  const verifyUser = async function(username, password) {
    let user = await getUser(username, password);
    if (user) {
      console.log(user)
    } else {
      console.log(`try again`)
    }
  }

  return (
    <div className="App">
      <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/">
            <LoginView
            verifyUser={verifyUser} />
          </Route>
          <Route exact path="/dashboard">
            <DashboardView />
          </Route>
        </Switch>
      </div>
      </ Router>
    </div>
  );
}
