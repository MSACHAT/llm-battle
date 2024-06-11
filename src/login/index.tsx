import { Input, Spin, Toast } from "@douyinfe/semi-ui";
import { Typography } from "@douyinfe/semi-ui";
import { Button, SplitButtonGroup } from "@douyinfe/semi-ui";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Divider } from "@douyinfe/semi-ui";
import { LoginButton } from "./LoginButton/LoginButton";
import { changePwdToUuid } from "@/middlewares/uuidMiddleWare";
import axios from "axios";
import config from "@/config/config";

export const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [passwd, setPasswd] = useState<string>("");
  const [loginResult, setLoginResult] = useState<boolean | null>(null);

  const handleLogin = async (status: boolean) => {
    const data = {
      username,
      password: passwd,
    };
    try {
      const res = await axios.post(config.apiUrl + "/user/login", data);
      if (res && res.data) {
        Toast.success("登录成功");
        console.log(res);
        localStorage.setItem("token", res.data);
        navigate("feed");
        setLoginResult(true);
      } else {
        setLoginResult(false);
      }
    } catch (error) {
      setLoginResult(false);
    }
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
              setUsername(value);
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
              disabled={!passwd || !username}
              account={username}
              password={passwd}
              onLogin={handleLogin}
            />
          </div>
          <div>
            <Typography.Text>
              如果没有账号点击这里
              <Typography.Text
                link={{ href: "http://172.10.21.42:8087/register" }}
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
