import React from "react";
import UserSignin from "../components/UserSignin";
import UserSignup from "../components/UserSignup";

const LoginPage = () => {
  return (
    <div className="signInPageDiv">
      <UserSignin />
      <UserSignup />
    </div>
  );
};

export default LoginPage;
