import { FC, useEffect, useRef } from "react";
import { Message } from "@/interface";
import "../singleChat/index.scss";
import { Spin } from "@douyinfe/semi-ui";

const BlinkingCursor: React.FC = () => {
  return <div className="cursor"></div>;
};

const BotReply = ({
  content,
  loading = false,
}: {
  content: string;
  loading?: boolean;
}) => {
  return (
    <div className={"bot-reply"}>
      <div className={"bot-chat-bubble"}>
        {loading && !content ? (
          <Spin size={"middle"} style={{ marginBottom: -8 }} />
        ) : (
          <>
            {content}
            {loading ? <BlinkingCursor /> : ""}
          </>
        )}
      </div>
    </div>
  );
};

const UserQuery = ({ content }: { content: string }) => {
  return (
    <div className={"user-query"}>
      <div className={"user-chat-bubble"}>{content}</div>
    </div>
  );
};

const MessageBox: FC<{
  streamMessage: string;
  messages: Message[];
  loading: boolean;
  title: string;
}> = ({ streamMessage, messages, loading, title }) => {
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
      id={"content" + title}
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
