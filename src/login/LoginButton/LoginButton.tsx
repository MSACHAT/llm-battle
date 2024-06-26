import { Button } from "@douyinfe/semi-ui";
import { ReactNode, useState } from "react";
import "./LoginButton.scss";

interface LoginButtonProps {
  disabled: boolean;
  account: string;
  password: string;
  onLogin: (status: boolean) => void;
  children: ReactNode;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  disabled,
  account,
  password,
  onLogin,
  children,
}) => {
  const [loginStatus, setLoginStatus] = useState<string | null>(null);

  const loginAction = (account: string, password: string) => {
    // send the post request
    interface Response {
      data: any;
      message: string;
      status: string;
    }

    interface LoginResData {
      token: string;
    }

    const fake_res = {
      data: {
        token: "abcdefg",
      },
      status: "error",
      message: "test",
    };
    const res = fake_res;
    const isSuccess = res.status === "success";
    setLoginStatus(isSuccess ? "success" : "error");
    onLogin(isSuccess);
    localStorage.setItem("token", res.data.token);
    return isSuccess;
  };

  return (
    <>
      <Button
        type="tertiary"
        className="loginButton"
        disabled={disabled}
        onClick={() => {
          loginAction(account, password);
        }}
      >
        {children}
      </Button>
    </>
  );
};
