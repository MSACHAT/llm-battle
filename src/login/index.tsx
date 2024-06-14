import { Input, Spin, Toast } from "@douyinfe/semi-ui";
import { Typography } from "@douyinfe/semi-ui";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Divider } from "@douyinfe/semi-ui";
import axios from "axios";
import config from "@/config/config";
import { LoginButton } from "@/login/LoginButton/LoginButton";

export const Login = ({ isRegister: isRegisterOrigin = false }) => {
  const navigate = useNavigate();
  const [isRegister, setIsregister] = useState(isRegisterOrigin);
  const [username, setUsername] = useState<string>("");
  const [passwd, setPasswd] = useState<string>("");
  const [loginResult, setLoginResult] = useState<boolean | null>(null);

  const handleLogin = async (status: boolean) => {
    const data = {
      username,
      password: passwd,
    };
    if (isRegister) {
      const res = await axios.post(config.apiUrl + "/user/register", data);
      if (res && res.data) {
        Toast.success("注册成功");
      } else {
        Toast.error("注册失败，请重试");
      }
    } else {
      try {
        const res = await axios.post(config.apiUrl + "/user/login", data);
        if (res && res.data) {
          !isRegister && Toast.success("登录成功");
          localStorage.setItem("token", res.data);
          navigate("/battle");
          setLoginResult(true);
        } else {
          setLoginResult(false);
        }
      } catch (error) {
        setLoginResult(false);
      }
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
            >
              {isRegister ? "注册" : "登录"}
            </LoginButton>
          </div>
          {!isRegister && (
            <div>
              <Typography.Text>
                如果没有账号点击这里
                <Typography.Text
                  link
                  onClick={() => {
                    setIsregister(true);
                  }}
                >
                  注册
                </Typography.Text>
              </Typography.Text>
            </div>
          )}
        </div>
        <Divider className="line" />
      </div>
    </div>
  );
};
