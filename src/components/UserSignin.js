import React, { useRef } from "react";
import firebase from "../firebase";

const UserSignin = () => {
  const userEmail = useRef("");
  const userPassword = useRef("");
  const signInForm = useRef("");
  const errorMessage = useRef("");

  const auth = firebase.auth();

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(
        userEmail.current.value,
        userPassword.current.value
      )
      .then((cred) => {
        console.log(cred);
      })
      .catch((err) => {
        errorMessage.current.innerHTML = `<p class='errorMessage'>${err.message}</p>`;
        signInForm.current.reset();
      });
  };

  return (
    <div>
      <h3>Sign In</h3>
      <form onSubmit={signIn} ref={signInForm}>
        <div className="formDiv">
          <label>Email:</label>
          <input type="text" className="formInput" ref={userEmail} />
          <div className="formDiv">
            <label>Password:</label>
            <input type="password" className="formInput" ref={userPassword} />
          </div>
        </div>

        <button className="sign-In-Up-Button">Sign In</button>
      </form>
      <p ref={errorMessage}></p>
    </div>
  );
};

export default UserSignin;
