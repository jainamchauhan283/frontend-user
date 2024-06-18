import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Main = () => {
  const accessToken = useSelector((state: any) => state.form.accessToken);
  debugger
  if (accessToken) {
    return <Navigate to="/taskpage" replace />;
  } else {
    return <Navigate to="/loginPage" replace />;
  }
};

export default Main;
