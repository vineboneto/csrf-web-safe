import { useLayoutEffect, useReducer } from "react";
import { Route, Router, Routes } from "react-router-dom";
import { createBrowserHistory, Update } from "history";
import Login from "./Login";
import Protected from "./Protected";

import "./App.css";

const history = createBrowserHistory();
const reducer = (_: Update, action: Update) => action;

export default function AppRoutes() {
  const [state, dispatch] = useReducer(reducer, {
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(dispatch), []);

  return (
    <Router
      navigator={history}
      location={state.location}
      navigationType={state.action}
    >
      <Routes>
        <Route path="/" element={<Protected />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
