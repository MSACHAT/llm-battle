import React from "react";
import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import { Battle } from "@/battle";
import { LeaderBoard } from "@/leaderBoard";
import { Chat } from "@/chat";

function App() {
  const body = document.body;
  body.setAttribute("theme-mode", "dark");
  const router = createBrowserRouter([
    {
      path: "/battle",
      element: <Battle />,
    },
    {
      path: "/leaderBoard",
      element: <LeaderBoard />,
    },
    {
      path: "/chat",
      element: <Chat />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
