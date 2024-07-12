import { FC, useEffect, useRef } from "react";
import { Message } from "@/interface";
import "../../singleChat/index.scss";
import { BotReply } from "@/battle/components/BotReplyBubble";
import { UserQuery } from "@/battle/components/UserQueryBubble";

const MessageBox: FC<{
  streamMessage: string;
  messages: Message[];
  loading: boolean;
  key: number;
}> = ({ streamMessage, messages, loading, key }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [streamMessage, messages]);

  return (
    <div
      id={"content" + key}
      ref={contentRef}
      style={{ overflowY: "auto", maxHeight: "100%" }}
    >
      {messages.map((message, index) => (
        <div key={index} className="message-container">
          {message.type === "query" ? (
            <UserQuery content={message.content} />
          ) : (
            <BotReply content={message.content} />
          )}
        </div>
      ))}
      {streamMessage || loading ? (
        <div className="message-container">
          <BotReply content={streamMessage} loading={loading} />
        </div>
      ) : null}
    </div>
  );
};

export default MessageBox;
