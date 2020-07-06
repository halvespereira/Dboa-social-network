import React, { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "./pages/loginPage";
import Home from "./pages/Home";
import firebase from "./firebase";

const App = () => {
  const auth = firebase.auth();

  const [user, setUser] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser([]);
      }
    });
  }, [auth]);

  if (user.length === 0) {
    return <LoginPage />;
  } else {
    return <Home userId={user.uid} />;
  }
};

export default App;
