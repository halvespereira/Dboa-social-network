import React from "react";
import UserSignin from "../components/UserSignin";
import UserSignup from "../components/UserSignup";

const LoginPage = () => {
  return (
    <>
      <div>
        <nav className="homeNav">
          <h3>Dboa Social</h3>
        </nav>
      </div>
      <div className="signInPageDiv">
        <UserSignin />
        <UserSignup />
      </div>
    </>
  );
};

export default LoginPage;
