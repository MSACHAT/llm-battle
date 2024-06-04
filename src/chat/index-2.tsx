import { Avatar, Button, Input, List } from "@douyinfe/semi-ui";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { LeftNavBar } from "./LeftNavBar/LeftNavBar";
import "./index.scss";
import axios from "axios";

type ChatMessage = {
  content: string;
  type: "reply" | "query";
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
    { content: "test1", type: "query" },
    { content: "test1", type: "reply" },
    { content: "test1", type: "query" },
    { content: "test1", type: "reply" },
    { content: "test1", type: "query" },
    { content: "test1", type: "reply" },
    { content: "test1", type: "query" },
    { content: "test1", type: "reply" },
    { content: "test1", type: "query" },
    { content: "test1", type: "reply" },
    { content: "test1", type: "query" },
    { content: "test1", type: "reply" },
    { content: "test1", type: "query" },
    { content: "test1", type: "reply" },
    { content: "test1", type: "query" },
    { content: "test1", type: "reply" },
    { content: "test1", type: "query" },
    { content: "test2", type: "reply" },
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

  function fetchData() {
    canAutoScrollRef.current = false;
    let newData = [...chatHistory];
    axios.get("https://mock/1").then((res) => {
      console.log(res);
      newData = [...res.data, ...newData];
    });
    // fake delay to simulate a time-consuming network request
    setTimeout(() => setChatHistory(newData), 1500);
  }

  const query = async (msg: string) => {
    try {
      setIsSending(true);
      setButtonContent("终止");
      const res = await fetch("https://api.coze.com/open_api/v2/chat", {
        headers: {
          Authorization:
            "Bearer pat_9qv4hQgwIGqJLxeqX7b0D0v7L8St7qHa4U0pvDxMblA4LzIO7ORkq135sSB2DGUt",
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

      const stream = new ReadableStream({
        async start(controller) {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const str = decoder.decode(value).slice(5);
            const obj = JSON.parse(str);
            console.log(obj.is_finish);
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
                    { content: currentReply, type: "reply" },
                  ];
                }
              });
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = window.setTimeout(() => {
                  setIsSending(false);
                  setButtonContent("发送");
                }, 5000);
              }
            } else {
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
            dataLength={chatHistory.length}
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
            // loader={<h4>Loading...</h4>}
          >
            <div ref={bottomRef} />
            <div className={"chat-history-list-content"}>
              {chatHistory.map((record) => {
                if (record.type === "query") {
                  return <UserQuery query={record.content} />;
                } else {
                  return <BotReply reply={record.content} />;
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
                setChatHistory((prevHistory) => [
                  ...prevHistory,
                  { content: userInput, type: "query" },
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
