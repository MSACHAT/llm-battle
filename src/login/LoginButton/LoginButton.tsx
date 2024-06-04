import { Avatar, Button, Input, List } from "@douyinfe/semi-ui";
import { useState, useEffect, useRef } from "react";
import "./LoginButton.scss";

export const LoginButton = () => {
  return (
    <Button type="tertiary" className="loginButton">
      登录
    </Button>
  );
};
