import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useState } from 'react'
import { LoginView } from "./Views/LoginView"
import { DashboardView } from "./Views/DashboardView"
import { api } from './API/api'
import './App.css';
import { UserContext } from './Models/UserContext';
import { BoardView } from './Views/BoardView'
import { NoMatch } from './Views/NoMatch'

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
        <Switch>
          <Route exact path="/">
            {loggedIn ? <Redirect to="/dashboard" /> :
            <LoginView checkUserCredentials={checkUserCredentials} />}
          </Route>
          <Route exact path="/dashboard">
              <DashboardView />
          </Route>
          <Route exact path="/:boardId/:boardName">
              <BoardView />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </ Router>
    </div>
    </UserContext.Provider>
  );
}
