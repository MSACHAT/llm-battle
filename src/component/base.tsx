import { Avatar, Dropdown, Nav, Space } from "@douyinfe/semi-ui";
import { Link, Outlet } from "react-router-dom";
import AIIcon from "./navigation-header-logo.svg";
import RuleIcon from "./icon-rules.svg";
import apiClient from "@/middlewares/axiosInterceptors";
import { CURRENT_IP } from "@/ipconfig";
import { Chat } from "@/singleChat/LeftNavBar/LeftNavBar";
import { useEffect, useState } from "react";

type NavItemKey = "battle" | "leaderBoard" | "chat";

export const NavigationBar = () => {
  const [lastConversationId, setLastConversationId] = useState("");
  useEffect(() => {
    apiClient.get(`http://${CURRENT_IP}/api/conversations`).then((res) => {
      const data = res as unknown as Chat[];
      if (data.length > 0) {
        setLastConversationId(data[0].conversation_id);
      } else {
        setLastConversationId("all");
      }
    });
  }, [lastConversationId]);
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
            chat: `/singleChat/${lastConversationId}`,
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
