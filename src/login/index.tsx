import { Input, Spin } from "@douyinfe/semi-ui";
import { Typography } from "@douyinfe/semi-ui";
import { Button, SplitButtonGroup } from "@douyinfe/semi-ui";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Divider } from "@douyinfe/semi-ui";
import { LoginButton } from "./LoginButton/LoginButton";

export const Login = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState<string>("");
  const [passwd, setPasswd] = useState<string>("");
  const [loginResult, setLoginResult] = useState<boolean | null>(null);

  const handleLogin = (status: boolean) => {
    setLoginResult(status);
  };

  const LoginAction = (account: string, passwd: string) => {
    const body = {
      username: account,
      password: passwd,
    };
  };
  return (
    <div className={"root"}>
      <div className={"Logo"}>
        <img className={"logo_img"} src="loginLogo.svg" alt="Logo" />
      </div>
      <div className={"Content"}>
        <div className={"login_title"}>
          <Typography.Title className={"title_text"} heading={2}>
            欢迎登录AI模型大PK
          </Typography.Title>
          <Input
            placeholder={"请输入账号"}
            onChange={(value: string) => {
              setAccount(value);
            }}
          />
          <Input
            placeholder={"请输入密码"}
            mode="password"
            onChange={(value: string) => {
              setPasswd(value);
            }}
          />
          {loginResult === false && (
            <div>
              <Typography.Text type={"danger"}>登录失败</Typography.Text>
            </div>
          )}
        </div>
        <div className={"login_button_footer"}>
          <div>
            <LoginButton
              disabled={!passwd || !account}
              account={account}
              password={passwd}
              onLogin={handleLogin}
            />
          </div>
          <div>
            <Typography.Text>
              如果没有账号点击这里
              <Typography.Text
                link={{ href: "http://localhost:3000/register" }}
              >
                注册
              </Typography.Text>
            </Typography.Text>
          </div>
        </div>
        <Divider className="line" />
      </div>
    </div>
  );
};
