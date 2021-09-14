import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useContext, useState } from 'react'
import { LoginView } from "./Views/LoginView"
import { DashboardView } from "./Views/DashboardView"
import { api } from './API/api'
import './App.css';
import { UserContext } from './Models/UserContext';
import { BoardView } from './Views/BoardView'
import { NoMatch } from './Views/NoMatch'

export function App() {
  const remote = api();
  const userDefaults = useContext(UserContext)
  const [user, setUser] = useState(userDefaults);
  const [error, setError] = useState(false)

  const checkUserCredentials = async function(email, password) {
    let response = await remote.authenticateAndGetUser(email, password);
    console.log('auth response is ', response)
    if (response) {
      setUser({
        currentUser: response,
        isLoggedIn: true,
        setLogOut: (isLoggedIn) => {
          if (isLoggedIn) {
            setUser(userDefaults)
            setError(false)
          };
        }
      });
      console.log('the state variable user is ', user)
    } else {
      setError(true)
    }
  }

  return (
    <UserContext.Provider value={user}>
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            {user.isLoggedIn ? <Redirect to={`/${user.currentUser.email}/boards`} /> :
            <LoginView checkUserCredentials={checkUserCredentials} error={error} />}
          </Route>
          <Route exact path="/login">
            {user.isLoggedIn ? <Redirect to={`/${user.currentUser.email}/boards`} /> :
            <LoginView checkUserCredentials={checkUserCredentials} error={error} />}
          </Route>
          <Route exact path="/:email/boards">
            {user.isLoggedIn ? <DashboardView /> :
            <Redirect to="/login" />}
          </Route>
          <Route exact path="/:boardId/:boardName">
            {user.isLoggedIn ? <BoardView /> :
            <Redirect to="/login" />}
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
