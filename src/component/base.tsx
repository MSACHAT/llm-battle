import { Avatar, Dropdown, Nav } from "@douyinfe/semi-ui";
import { Link } from "react-router-dom";

export const NavigationBar = () => {
  return (
    <Nav
      header={{
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
    ></Nav>
  );
};
