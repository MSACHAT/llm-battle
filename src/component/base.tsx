import { Avatar, Dropdown, Nav, Space, Tooltip } from "@douyinfe/semi-ui";
import { Link, Outlet } from "react-router-dom";
import AIIcon from "./navigation-header-logo.svg";
import RuleIcon from "./icon-rules.svg";
import "./index.scss";
type NavItemKey = "battle" | "leaderBoard" | "chat";
interface NavBarProps {
  beShown: boolean;
}
export const NavigationBar: React.FC<NavBarProps> = ({ beShown }) => {
  if (beShown === false) {
    return (
      <div>
        <Nav
          header={{
            logo: <img src={AIIcon} />,
            text: "AI模型大PK",
          }}
          mode={"horizontal"}
        />
        <Outlet />
      </div>
    );
  }
  return (
    <div>
      <Nav
        header={{
          logo: <img src={AIIcon} />,
          text: "AI模型大PK",
        }}
        mode={"horizontal"}
        renderWrapper={({ itemElement, props }) => {
          const routerMap: Record<NavItemKey, string> = {
            battle: "/battle",
            leaderBoard: "/leaderBoard",
            chat: "/singleChat",
          };
          const itemKey = props.itemKey as NavItemKey;
          return (
            <Link style={{ textDecoration: "none" }} to={routerMap[itemKey]}>
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
            <Tooltip
              position={"bottom"}
              content={
                <div className={"PK-tooltip"}>
                  PK规则：
                  <ul>
                    <li>向两个匿名模型提出任何问题，并投票给更好的一个！</li>
                    <li>您可以多轮聊天，直到确定获胜者。</li>
                    <li>如果在对话过程中暴露模特身份，则不会计算选票。</li>
                  </ul>
                </div>
              }
            >
              <img src={RuleIcon} style={{ width: 32, height: 32 }} />
            </Tooltip>

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
