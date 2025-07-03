import React from "react";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <h1 className="text-3xl font-bold">Login Form</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
