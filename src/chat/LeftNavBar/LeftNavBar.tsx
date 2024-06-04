import "./LeftNavBar.scss";
import { Button, Image } from "@douyinfe/semi-ui";

type Chat = {
  chatTitle: string;
  chatModel: string;
  chosen: boolean;
};
export const NewChatButton = () => {
  return <Button className={"new-chat-button"}>新建聊天</Button>;
};
export const ChatBlock = ({
  chatTitle,
  chatModel,
  chosen,
}: {
  chatTitle: string;
  chatModel: string;
  chosen: boolean;
}) => {
  return (
    <div className={"chat-block-root"}>
      <div className={"chat-block" + (chosen ? " chat-block-chosen" : "")}>
        <div className={"icon-and-title"}>
          <Image
            className={"comment-icon"}
            src={"/comment_icon.png"}
            width={24}
            height={24}
          />
          {chatTitle}
        </div>
        <div className={"operations"}>
          <Image
            className={"pencil-icon"}
            src={"/pencil_icon.png"}
            width={24}
            height={24}
          />
          <Image
            className={"rubbish-bin-icon"}
            src={"/rubbish_bin_icon.png"}
            width={24}
            height={24}
          />
        </div>
      </div>
      <div className={"model-source"}>模型来源: {chatModel}</div>
    </div>
  );
};
export const LeftNavBar = ({ chats }: { chats: Chat[] }) => {
  return (
    <div className={"left-nav-bar"}>
      <div className={"chat-block-list"}>
        {chats.map((chat: Chat) => {
          return (
            <ChatBlock
              chatTitle={chat.chatTitle}
              chatModel={chat.chatModel}
              chosen={chat.chosen}
            />
          );
        })}
      </div>
      <div className={"chat-button-sector"}>
        <NewChatButton />
      </div>
    </div>
  );
};
