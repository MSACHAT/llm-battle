import MessageBox from "./MessageBox";
import { Message } from "@/interface";
import "../index.scss";
import { ReactNode } from "react";

export const BattleComponent = ({
  messages,
  streamMessage,
  loading,
  title,
  key,
}: {
  messages: Message[];
  streamMessage: string;
  loading: boolean;
  title: ReactNode;
  key: number;
}) => {
  return (
    <div className={"battle-single-chat"}>
      {title}
      <div className={"single-chat-area"}>
        <MessageBox
          streamMessage={streamMessage}
          messages={messages}
          loading={loading}
          key={key}
        />
      </div>
    </div>
  );
};
