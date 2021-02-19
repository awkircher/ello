import {
  BrowserRouter as Router,
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

  const checkUserCredentials = async function(username, password) {
    let response = await remote.authenticateAndGetUser(username, password);
    if (response) {
      setUser({
        currentUser: response,
        isLoggedIn: true,
        setLogOut: (isLoggedIn) => {
          if (isLoggedIn) {
            setUser(userDefaults)
          };
        }
      });
      console.log(user)
    } else {
      console.log(`try again`)
    }
  }

  return (
    <UserContext.Provider value={user}>
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            {user.isLoggedIn ? <Redirect to={`/${user.currentUser.username}/boards`} /> :
            <LoginView checkUserCredentials={checkUserCredentials} />}
          </Route>
          <Route exact path="/login">
            {user.isLoggedIn ? <Redirect to={`/${user.currentUser.username}/boards`} /> :
            <LoginView checkUserCredentials={checkUserCredentials} />}
          </Route>
          <Route exact path="/:username/boards">
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
