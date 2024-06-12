import { FC, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { Message } from "@/interface";
import { Avatar, Button, Input } from "@douyinfe/semi-ui";
import InfiniteScroll from "react-infinite-scroll-component";
import "./index.scss";
import Title from "@douyinfe/semi-ui/lib/es/typography/title";

type ChatMessage = {
  content: string;
  type: "reply" | "query";
  id: number;
};
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const MAX_DATA = 30;
  const hasMore = chatHistory.length < MAX_DATA;
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
  //
  // return;
  // <div className={"single-chat"}>
  //   <div className={"single-chat-content"}>
  //     <div className={"chat-history-list"} id="chat-history-list">
  //       <InfiniteScroll
  //         endMessage={"没有更多数据了"}
  //         dataLength={chatHistory.length}
  //         scrollableTarget={"chat-history-list"}
  //         loader={<p className="text-center m-5">⏳&nbsp;Loading...</p>}
  //         inverse={true}
  //         hasMore={hasMore}
  //         next={() => {
  //           console.log();
  //         }}
  //         style={{
  //           display: "flex",
  //           flexDirection: "column-reverse",
  //           overflow: "visible",
  //         }}
  //       >
  //         <div ref={bottomRef} />
  //         <div className={"chat-history-list-content"}>
  //           <MessageBox
  //             streamMessage={streamMessage}
  //             messages={messages}
  //             loading={loading}
  //           />
  //         </div>
  //       </InfiniteScroll>
  //     </div>
  //   </div>
  // </div>;
};
