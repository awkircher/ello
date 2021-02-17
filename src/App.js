import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { useState } from 'react'
import { LoginView } from "./Views/LoginView"
import { DashboardView } from "./Views/DashboardView"
import { api } from './API/api'
import './App.css';
import { UserContext } from './Models/UserContext';

export function App() {
  const [loggedIn, setLoggedIn] = useState();
  const remote = api();
  const checkUserCredentials = async function(username, password) {
    let user = await remote.authenticateUser(username, password);
    if (user) {
      setLoggedIn(user);
    } else {
      console.log(`try again`)
    }
  }

  return (
    <UserContext.Provider value={loggedIn}>
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
            {loggedIn ? <Redirect to="/dashboard" /> :
            <LoginView checkUserCredentials={checkUserCredentials} />}
          </Route>
          <Route exact path="/dashboard">
              <DashboardView />
          </Route>
        </Switch>
      </div>
      </ Router>
    </div>
    </UserContext.Provider>
  );
}
