import { Avatar, Dropdown, Nav, Space, Tooltip } from "@douyinfe/semi-ui";
import { Link, Outlet } from "react-router-dom";
import AIIcon from "./navigation-header-logo.svg";
import RuleIcon from "./icon-rules.svg";
import { useEffect, useState } from "react";
import "./index.scss";
import apiClient from "@/middlewares/axiosInterceptors";
import { Chat } from "@/singleChat/LeftNavBar/LeftNavBar";

type NavItemKey = "battle" | "leaderBoard" | "chat";

interface NavBarProps {
  beShown: boolean;
}

export const NavigationBar: React.FC<NavBarProps> = ({ beShown }) => {
  const [lastConversationId, setLastConversationId] = useState("");
  useEffect(() => {
    apiClient.get(`/api/conversations`).then((res) => {
      const data = res as unknown as Chat[];
      if (data.length > 0) {
        setLastConversationId(data[0].conversation_id);
      } else {
        setLastConversationId("all");
      }
    });
  }, [lastConversationId]);
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
            // chat: `/singleChat/${lastConversationId}`,
            chat: `/singleChat/1`, //TODO 修改
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
              position={"bottomRight"}
              content={
                <div className={"PK-tooltip"}>
                  <ul>
                    PK规则：
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
