import React, { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Battle } from "./battle/index";
import { LeaderBoard } from "./leaderBoard/index";
import { NavigationBar } from "./component/base";
import { SingleChat } from "src/singleChat";
import { Login } from "@/login/index";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    const body = document.body;
    body.setAttribute("theme-mode", "dark");
  }, []);

  const token = localStorage.getItem("token");
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={<Navigate to={token ? "/battle" : "/login"} />}
        />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<NavigationBar beShown={true} />}>
            <Route path="battle" element={<Battle />} />
            <Route path="leaderBoard" element={<LeaderBoard />} />
            <Route path="singleChat" element={<SingleChat />} />
          </Route>
        </Route>
        <Route path="/" element={<NavigationBar beShown={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login isRegister={true} />} />
        </Route>
      </>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
