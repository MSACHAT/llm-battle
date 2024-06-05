import { Avatar, Button, Input, List } from "@douyinfe/semi-ui";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { LeftNavBar } from "./LeftNavBar/LeftNavBar";
import "./index.scss";
import axios from "axios";

type ChatMessage = {
  content: string;
  type: "reply" | "query";
  id: number;
};

const BotReply = ({ reply }: { reply: string }) => {
  return (
    <div className={"bot-reply"}>
      <Avatar
        size="medium"
        alt="Bot"
        src={"/bot_avatar.png"}
        className={"bot-avatar"}
      />
      <div className={"bot-chat-bubble"}>{reply}</div>
    </div>
  );
};

const UserQuery = ({ query }: { query: string }) => {
  return (
    <div className={"user-query"}>
      <div className={"user-chat-bubble"}>{query}</div>
      <Avatar size="medium" alt="User" className={"user-avatar"}>
        YD
      </Avatar>
    </div>
  );
};

export const Chat = () => {
  const fakeData: ChatMessage[] = [
    { content: "test1", type: "query", id: 1 },
    { content: "test1", type: "reply", id: 2 },
    { content: "test1", type: "query", id: 3 },
    { content: "test1", type: "reply", id: 4 },
    { content: "test1", type: "query", id: 5 },
    { content: "test1", type: "reply", id: 6 },
    { content: "test1", type: "query", id: 7 },
    { content: "test1", type: "reply", id: 8 },
    { content: "test1", type: "query", id: 9 },
    { content: "test1", type: "reply", id: 10 },
    { content: "test1", type: "query", id: 11 },
    { content: "test1", type: "reply", id: 12 },
    { content: "test1", type: "query", id: 13 },
    { content: "test1", type: "reply", id: 14 },
    { content: "test1", type: "query", id: 15 },
    { content: "test1", type: "reply", id: 16 },
    { content: "test1", type: "query", id: 17 },
    { content: "test2", type: "reply", id: 18 },
  ];
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([...fakeData]);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const [buttonContent, setButtonContent] = useState("发送");
  const isSendingRef = useRef(isSending); // 创建一个ref来跟踪isSending的值
  const MAX_DATA = 30;
  const hasMore = chatHistory.length < MAX_DATA;
  const canAutoScrollRef = useRef(true);
  const chatHistoryLength = useRef(chatHistory.length);

  function fetchData() {
    canAutoScrollRef.current = false;
    let newData = [...chatHistory];
    axios.get("https://mock/1").then((res) => {
      console.log(res);
      newData = [...res.data, ...newData];
      setTimeout(() => setChatHistory([...res.data, ...chatHistory]), 1500);
    });
    // fake delay to simulate a time-consuming network request
  }

  const query = async (msg: string) => {
    await new Promise((resolve) => setTimeout(resolve, 100)); // 等待下一个事件循环
    try {
      setIsSending(true);
      setButtonContent("终止");
      const res = await fetch("https://api.coze.com/open_api/v2/chat", {
        headers: {
          Authorization:
            "Bearer pat_4F9lbr5UTmXpGJClGfa6HylNSSIFkKdbJu4cUwr2mr8cPcV5wk8IpOvI94xG0oNm",
          "Content-Type": "application/json",
          Accept: "*/*",
          Host: "api.coze.com",
          Connection: "keep-alive",
        },
        method: "POST",
        body: JSON.stringify({
          conversation_id: "123",
          bot_id: "7372104038311739410",
          user: "29032201862555",
          query: msg,
          stream: true,
        }),
      });
      if (!res.ok) {
        return new Response(res.body, {
          status: res.status,
        });
      }

      const decoder = new TextDecoder();
      const reader = res.body?.getReader();

      if (!reader) {
        throw new Error("Reader is undefined");
      }

      let currentReply = "";
      timeoutRef.current = window.setTimeout(() => {
        setIsSending(false);
        setButtonContent("发送");
      }, 5000);
      await new Promise((resolve) => setTimeout(resolve, 100)); // 等待下一个事件循环
      const stream = new ReadableStream({
        async start(controller) {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            console.log(done, decoder.decode(value));
            const jsonString = decoder
              .decode(value)
              .replace(/^data:/, "")
              .trim();
            const obj = JSON.parse(jsonString);
            console.log(obj, obj.is_finish);
            if (!obj.is_finish) {
              const chunk = obj.message.content;
              currentReply += chunk;
              setChatHistory((prevHistory) => {
                const lastMessage = prevHistory[prevHistory.length - 1];
                if (lastMessage && lastMessage.type === "reply") {
                  return [
                    ...prevHistory.slice(0, -1),
                    { ...lastMessage, content: currentReply },
                  ];
                } else {
                  return [
                    ...prevHistory,
                    {
                      content: currentReply,
                      type: "reply",
                      id: chatHistoryLength.current + 1,
                    },
                  ];
                }
              });
              if (timeoutRef.current) {
                chatHistoryLength.current += 1;
                clearTimeout(timeoutRef.current);
                timeoutRef.current = window.setTimeout(() => {
                  setIsSending(false);
                  setButtonContent("发送");
                }, 5000);
              }
            } else {
              chatHistoryLength.current += 1;
              // setChatHistory((prevHistory) => [
              //   ...prevHistory,
              //   { content: currentReply, type: "reply" },
              // ]);
              currentReply = "";
              clearTimeout(timeoutRef.current!);
              setIsSending(false);
              setButtonContent("发送");
              break;
            }
          }
          controller.close();
        },
      });

      return new Response(stream);
    } catch (e: any) {
      console.log("Error", e);
      clearTimeout(timeoutRef.current!);
      setIsSending(false);
      setButtonContent("发送");
      return new Response(
        JSON.stringify({ msg: e?.message || e?.stack || e }),
        {
          status: 500,
        },
      );
    }
  };

  useEffect(() => {
    if (canAutoScrollRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);
  useEffect(() => {
    // 同步isSending的值到ref
    isSendingRef.current = isSending;
  }, [isSending]); // 依赖于isSending，当isSending变化时更新ref

  useEffect(() => {
    return () => {
      // 这里的代码会在组件卸载时执行
      if (isSendingRef.current) {
        console.log("发送终止请求");
      }
    };
  }, []); // 空数组表示这个effect没有依赖项，因此不会重新执行
  console.log(chatHistory);
  return (
    <div className={"single-chat"}>
      <LeftNavBar
        chats={[
          {
            chatModel: "gpt-4",
            chatTitle: "welcome",
            chosen: true,
          },
        ]}
      />
      <div className={"single-chat-content"}>
        <div className={"chat-history-list"} id="chat-history-list">
          <InfiniteScroll
            endMessage={"没有更多数据了"}
            dataLength={chatHistoryLength.current}
            scrollableTarget={"chat-history-list"}
            loader={<p className="text-center m-5">⏳&nbsp;Loading...</p>}
            inverse={true}
            hasMore={hasMore}
            next={fetchData}
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              overflow: "visible",
            }}
          >
            <div ref={bottomRef} />
            <div className={"chat-history-list-content"}>
              {chatHistory
                .sort((a, b) => b.id - a.id)
                .map((record, index) => {
                  if (record.type === "query") {
                    return <UserQuery key={index} query={record.content} />;
                  } else {
                    return <BotReply key={index} reply={record.content} />;
                  }
                })}
            </div>
          </InfiniteScroll>
        </div>
        <div className={"user-input"}>
          <Input
            value={userInput}
            onChange={(value: string, e: React.ChangeEvent<HTMLInputElement>) =>
              setUserInput(value)
            }
            className={"input-area"}
          ></Input>
          <Button
            className={"send-button"}
            onClick={() => {
              if (!isSending) {
                canAutoScrollRef.current = true;
                chatHistoryLength.current += 1;
                setChatHistory((prevHistory) => [
                  ...prevHistory,
                  {
                    content: userInput,
                    type: "query",
                    id: chatHistoryLength.current + 1,
                  },
                ]);
                setUserInput("");
                query(userInput);
              } else {
                console.log("发送结束请求");
                setIsSending(false);
              }
            }}
            disabled={!userInput.trim() && !isSending} // Disable the button when input is empty or sending
          >
            {isSending ? <>{buttonContent}</> : <>发送</>}
          </Button>
        </div>
      </div>
    </div>
  );
};
