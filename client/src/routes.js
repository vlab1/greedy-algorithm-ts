import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./components/pages/main/Main.jsx";
export const useRoutes = () => {
  return (
    <Routes>
      <Route path="/main" exact element={<Main />} />
      <Route path="/*" element={<Navigate replace to="/main" />} />
    </Routes>
  );
};
