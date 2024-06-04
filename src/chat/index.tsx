import { Avatar, Button, Input, List } from "@douyinfe/semi-ui";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { LeftNavBar } from "@/chat/LeftNavBar/LeftNavBar";
import "./index.scss";

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
    { content: "test1", type: "reply" },
  ];
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([...fakeData]);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const query = async (msg: string) => {
    try {
      setIsSending(true);
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
      return new Response(
        JSON.stringify({ msg: e?.message || e?.stack || e }),
        {
          status: 500,
        },
      );
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const isSendButtonDisabled = isSending || !userInput.trim();

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
        <InfiniteScroll
          threshold={80}
          useWindow={true}
          isReverse={true}
          hasMore={true}
          loadMore={() => {
            console.log("LOAD MORE");
          }}
          // loader={<h4>Loading...</h4>}
        >
          <div className={"chat-history-list"}>
            <List
              dataSource={chatHistory}
              renderItem={(record) => {
                if (record.type === "query") {
                  return <UserQuery query={record.content} />;
                } else {
                  return <BotReply reply={record.content} />;
                }
              }}
              loading={false}
            />
            <div ref={bottomRef} />
          </div>
        </InfiniteScroll>
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
              setChatHistory((prevHistory) => [
                ...prevHistory,
                { content: userInput, type: "query" },
              ]);
              setUserInput("");
              query(userInput);
            }}
            disabled={isSendButtonDisabled} // Disable the button when input is empty or sending
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};
