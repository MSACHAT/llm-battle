import MessageBox from "./MessageBox";
import { Message } from "@/interface";
import "../index.scss";
import Title from "@douyinfe/semi-ui/lib/es/typography/title";

export const BattleComponent = ({
  messages,
  streamMessage,
  loading,
  title,
}: {
  messages: Message[];
  streamMessage: string;
  loading: boolean;
  title: string;
}) => {
  return (
    <div className={"battle-single-chat"}>
      <Title heading={5}>{title}</Title>
      <div className={"single-chat-area"}>
        <MessageBox
          streamMessage={streamMessage}
          messages={messages}
          loading={loading}
          title={title}
        />
      </div>
    </div>
  );
};
