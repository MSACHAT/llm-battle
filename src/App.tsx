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

function App() {
  const body = document.body;
  body.setAttribute("theme-mode", "dark");

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<NavigationBar />}>
        <Route path="battle" element={<Battle />} />
        <Route path="leaderBoard" element={<LeaderBoard />} />
        <Route path="singleChat" element={<SingleChat />} />
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
}

export default App;
