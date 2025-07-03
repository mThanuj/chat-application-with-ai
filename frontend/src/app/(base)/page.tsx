"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import React from "react";

const Home = () => {
  const router = useRouter();
  const logout = async () => {
    await axiosInstance.get("/auth/logout");
    router.push("/login");
  };

  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;
