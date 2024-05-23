import { Avatar, Dropdown, Nav, Space } from "@douyinfe/semi-ui";
import { Link, Outlet } from "react-router-dom";
import AIIcon from "./navigation-header-logo.svg";
import RuleIcon from "./icon-rules.svg";
export const NavigationBar = () => {
  return (
    <div>
      <Nav
        header={{
          logo: <img src={AIIcon} />,
          text: "AI模型大PK",
        }}
        mode={"horizontal"}
        renderWrapper={({ itemElement, isSubNav, isInSubNav, props }) => {
          const routerMap = {
            battle: "/battle",
            leaderBoard: "/leaderBoard",
            chat: "/chat",
          };
          return (
            <Link
              style={{ textDecoration: "none" }}
              // @ts-ignore
              to={routerMap[props.itemKey]}
            >
              {itemElement}
            </Link>
          );
        }}
        items={[
          { itemKey: "battle", text: "首页" },
          { itemKey: "leaderBoard", text: "排行榜" },
          { itemKey: "chat", text: "单聊" },
        ]}
        footer={
          <Space>
            <img src={RuleIcon} style={{ width: 32, height: 32 }} />
            <Dropdown
              position="bottomRight"
              render={
                <Dropdown.Menu>
                  <Dropdown.Item>退出</Dropdown.Item>
                </Dropdown.Menu>
              }
            >
              <Avatar size={"small"} style={{ margin: 4 }}>
                U
              </Avatar>
              <span>用户1</span>
            </Dropdown>
          </Space>
        }
      />
      <Outlet />
    </div>
  );
};
