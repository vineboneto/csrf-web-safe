import { useLayoutEffect, useReducer } from "react";
import { Route, Router, Routes } from "react-router-dom";
import { Update } from "history";
import Login from "./Login";
import Protected from "./Protected";
import AuthProvider from "./AuthContext";
import { history } from "./history";

import "./App.css";

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
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Protected />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
