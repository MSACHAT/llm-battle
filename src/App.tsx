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
import { Chat } from "@/chat";
import { NavigationBar } from "@/component/base";

function App() {
  const body = document.body;
  body.setAttribute("theme-mode", "dark");

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<NavigationBar />}>
        <Route path="battle" element={<Battle />} />
        <Route path="leaderBoard" element={<LeaderBoard />} />
        <Route path="chat" element={<Chat />} />
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
}

export default App;
