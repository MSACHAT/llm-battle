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
import { Login } from "@/login/index";
import { Chat } from "@/chat";

function App() {
  const body = document.body;
  body.setAttribute("theme-mode", "dark");

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<NavigationBar beShown={true} />}>
          <Route path="battle" element={<Battle />} />
          <Route path="leaderBoard" element={<LeaderBoard />} />
          <Route path="chat" element={<Chat />} />
        </Route>
        <Route path="/" element={<NavigationBar beShown={false} />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </>,
    ),
  );
  return <RouterProvider router={router} />;
}

export default App;
