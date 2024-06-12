import { FC, useCallback, useEffect } from "react";
import { throttle } from "lodash-es";
import { Message } from "@/interface";
import { Avatar } from "@douyinfe/semi-ui";
// import "./index.scss";

const BotReply = ({ content }: { content: string }) => {
  return (
    <div className={"bot-reply"}>
      <Avatar
        size="medium"
        alt="Bot"
        src={"/bot_avatar.png"}
        className={"bot-avatar"}
      />
      <div className={"bot-chat-bubble"}>{content}</div>
    </div>
  );
};

const UserQuery = ({ content }: { content: string }) => {
  return (
    <div className={"user-query"}>
      <div className={"user-chat-bubble"}>{content}</div>
      <Avatar size="medium" alt="User" className={"user-avatar"}>
        YD
      </Avatar>
    </div>
  );
};

const MessageBox: FC<{
  streamMessage: string;
  messages: Message[];
  loading: boolean;
}> = ({ streamMessage, messages, loading }) => {
  const handleAutoScroll = useCallback(
    throttle(() => {
      const element = document.querySelector("#content");
      element!.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300),
    [],
  );

  useEffect(() => {
    handleAutoScroll();
  }, [streamMessage]);

  useEffect(() => {
    const clock = setTimeout(() => {
      handleAutoScroll();
    }, 300);

    return () => {
      clearTimeout(clock);
    };
  }, [messages]);
  return (
    <div id="content">
      {messages.map((message, index) => {
        if (message.type === "query") {
          return <UserQuery key={index} content={message.content} />;
        } else {
          return <BotReply key={index} content={message.content} />;
        }
      })}
      {streamMessage ? <BotReply content={streamMessage} /> : null}
      {loading ? <div>Loading...</div> : null}
    </div>
  );
};

export default MessageBox;
