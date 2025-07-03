"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const LoginSuccess = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("accessToken", token);
      window.location.href = "/";
    }
  }, [token]);

  return <p>Logging in...</p>;
};

export default LoginSuccess;
