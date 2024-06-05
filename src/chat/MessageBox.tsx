import { FC, useCallback, useEffect } from "react";
import { throttle } from "lodash-es";
import { ConversationMode, Message } from "@/interfaces";

const MessageItem: FC<{
  message: Message;
  mode?: ConversationMode;
  index?: number;
}> = ({ message, index }) => {
  // const createdAt = getRelativeTime(message.createdAt, true);

  return (
    <div>
      {message.role === "assistant" ? <div>Assistant Avatar</div> : null}
      <div>
        <div>{message.content}</div>
        {/*<div>{createdAt ? <div>{createdAt}</div> : <div />}</div>*/}
      </div>
    </div>
  );
};

const MessageBox: FC<{
  streamMessage: string;
  messages: Message[];
  mode: ConversationMode;
  loading: boolean;
}> = ({ streamMessage, messages, mode, loading }) => {
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
      {messages.length === 0 ? <div>No messages</div> : null}
      {messages.map((message, index) => (
        <MessageItem key={index} index={index} mode={mode} message={message} />
      ))}
      {streamMessage ? (
        <MessageItem message={{ role: "assistant", content: streamMessage }} />
      ) : null}
      {loading ? <div>Loading...</div> : null}
    </div>
  );
};

export default MessageBox;
