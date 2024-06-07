import React from "react";
import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Battle } from "@/battle";
import { LeaderBoard } from "@/leaderBoard";
import { NavigationBar } from "@/component/base";
import { Chat } from "@/chat";
import Content from "@/chat/index3";

function App() {
  const body = document.body;
  body.setAttribute("theme-mode", "dark");

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<NavigationBar />}>
        <Route path="battle" element={<Battle />} />
        <Route path="leaderBoard" element={<LeaderBoard />} />
        <Route path="chat" element={<Content />} />
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
}

export default App;
