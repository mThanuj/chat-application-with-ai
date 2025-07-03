import React from "react";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <h1 className="text-3xl font-bold">Register Form</h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
