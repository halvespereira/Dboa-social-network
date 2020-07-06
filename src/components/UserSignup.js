import React, { useRef } from "react";
import firebase from "../firebase";

const UserSignup = () => {
  const userEmail = useRef("");
  const userPassword = useRef("");
  const signupForm = useRef("");
  const userBio = useRef("");
  const userAge = useRef("");
  const errorMessage = useRef("");
  const userName = useRef("");

  const auth = firebase.auth();
  const db = firebase.firestore();

  const createUser = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(
        userEmail.current.value,
        userPassword.current.value
      )
      .then((cred) => {
        debugger;
        db.collection("users")
          .doc(cred.user.uid)
          .set({
            name: userName.current.value,
            email: userEmail.current.value,
            age: userAge.current.value,
            bio: userBio.current.value,
            followers: [],
            posts: [],
            userId: cred.user.uid,
          })
          .then(console.log("Account created and firestore updated!"))
          .catch((err) => {
            debugger;
          });
      })
      .catch((err) => {
        console.log(err);
        errorMessage.current.innerHTML = `<p class='errorMessage'>${err.message}</p>`;
        signupForm.current.reset();
      });
  };

  return (
    <div>
      <h3>Sign Up</h3>
      <form onSubmit={createUser} ref={signupForm}>
        <div className="formDiv">
          <label>Email:</label>
          <input
            type="text"
            className="formInput"
            id="newUserEmail"
            ref={userEmail}
          />
          <div className="formDiv">
            <label>Password:</label>
            <input
              type="password"
              className="formInput"
              id="newUserPassword"
              ref={userPassword}
            />
          </div>
          <div className="formDiv">
            <label>Full Name:</label>
            <input
              type="text"
              className="formInput"
              id="newUserName"
              ref={userName}
            />
          </div>
          <div className="formDiv">
            <label>Bio:</label>
            <textarea
              type="textarea"
              rows="5"
              cols="15"
              id="newUserBio"
              ref={userBio}
            ></textarea>
          </div>
          <div className="formDiv">
            <label>Age:</label>
            <input
              type="number"
              className="formInput"
              id="newUserAge"
              ref={userAge}
            />
          </div>
        </div>
        <button className="sign-In-Up-Button">Sign Up</button>
      </form>
      <p ref={errorMessage}></p>
    </div>
  );
};

export default UserSignup;
