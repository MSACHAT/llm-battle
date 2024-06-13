import React from "react";
import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Battle } from "./battle/index";
import { LeaderBoard } from "./leaderBoard/index";
import { NavigationBar } from "./component/base";
import { SingleChat } from "src/singleChat";
import { Login } from "@/login/index";

function App() {
  const body = document.body;
  body.setAttribute("theme-mode", "dark");
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<NavigationBar beShown={true} />}>
          <Route path="battle" element={<Battle />} />
          <Route path="leaderBoard" element={<LeaderBoard />} />
          <Route path="singleChat/:conversationId" element={<SingleChat />} />
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
