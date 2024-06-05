import { FC, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { Message, ReactSetState } from "@/interfaces";
import { Avatar, Button, Input } from "@douyinfe/semi-ui";
import { LeftNavBar } from "./LeftNavBar/LeftNavBar";
import "./index.scss";
import InfiniteScroll from "react-infinite-scroll-component";

type ChatMessage = {
  content: string;
  type: "reply" | "query";
  id: number;
};

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
const Content: FC = () => {
  // input text
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([...fakeData]);
  const MAX_DATA = 30;
  const hasMore = chatHistory.length < MAX_DATA;
  // controller
  const [controller, setController] = useState<any>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamMessage, setStreamMessage] = useState("");

  const sendTextChatMessages = async (content: string) => {
    // temp stream message
    let tempMessage = "";
    console.log(tempMessage, 11111);
    const input: Message[] = [
      {
        type: "query",
        content,
        createdAt: Date.now(),
        id: messages.length,
      },
    ];
    const allMessages: Message[] = messages.concat(input);
    setMessages(allMessages);
    await new Promise((resolve) => setTimeout(resolve, 100)); // 等待下一个事件循环
    setText("");
    setLoading(true);

    try {
      const abortController = new AbortController();
      setController(abortController);
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
          query: content,
          stream: true,
        }),
        signal: abortController.signal,
      });

      const stream = res.body;
      const reader = stream?.getReader();
      const decoder = new TextDecoder();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader!.read();
        if (done) {
          break;
        }
        if (value) {
          console.log(decoder.decode(value), tempMessage);
          const jsonString = decoder
            .decode(value)
            .replace(/^data:/, "")
            .trim();
          const obj = JSON.parse(jsonString);
          if (obj.is_finish) {
            break;
          }
          if (obj.message.content && !obj.is_finish) {
            tempMessage += obj.message.content;
            console.log(tempMessage, 22222);
            // eslint-disable-next-line no-loop-func
            setStreamMessage(tempMessage);
          }
        }
      }
      const now = Date.now();
      const newMessage = {
        content: tempMessage,
        createdAt: now,
        id: messages.length,
      };

      console.log(newMessage);
      setMessages((prevMessages) => {
        const updatedMessage = {
          ...newMessage,
          type: "reply",
          id: prevMessages.length,
        };
        return prevMessages.concat([updatedMessage]);
      });
      setStreamMessage("");
      tempMessage = "";
    } catch (e: any) {
      // abort manually or not
      if (!tempMessage) {
        setMessages((msgs) =>
          msgs.concat([
            {
              type: "reply",
              id: msgs.length,
              content: `Error: ${e.message || e.stack || e}`,
              createdAt: Date.now(),
            },
          ]),
        );
      }
    } finally {
      setController(null);
      setLoading(false);
    }
  };
  const stopGenerate = () => {
    controller?.abort?.();
    if (streamMessage) {
      setMessages((msgs) =>
        msgs.concat([
          {
            type: "reply",
            id: msgs.length,
            content: streamMessage,
            createdAt: Date.now(),
          },
        ]),
      );
      setStreamMessage("");
    }
  };
  console.log(messages);

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
            next={() => {
              console.log();
            }}
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              overflow: "visible",
            }}
          >
            <div ref={bottomRef} />
            <div className={"chat-history-list-content"}>
              <MessageBox
                streamMessage={streamMessage}
                messages={messages}
                loading={loading}
              />
            </div>
          </InfiniteScroll>
        </div>
        <div className={"user-input"}>
          <Input
            autoFocus
            style={{ background: "white" }}
            value={text}
            onChange={(v) => setText(v)}
            // streamMessage={streamMessage}
            onEnterPress={() => {
              stopGenerate();
              sendTextChatMessages(text);
            }}
            // onCancel={stopGenerate}
            // loading={loading}
          />
          {/*<Button*/}
          {/*  className={"send-button"}*/}
          {/*  onClick={() => {*/}
          {/*    if (!isSending) {*/}
          {/*      canAutoScrollRef.current = true;*/}
          {/*      chatHistoryLength.current += 1;*/}
          {/*      setChatHistory((prevHistory) => [*/}
          {/*        ...prevHistory,*/}
          {/*        {*/}
          {/*          content: userInput,*/}
          {/*          type: "query",*/}
          {/*          id: chatHistoryLength.current + 1,*/}
          {/*        },*/}
          {/*      ]);*/}
          {/*      setUserInput("");*/}
          {/*      query(userInput);*/}
          {/*    } else {*/}
          {/*      console.log("发送结束请求");*/}
          {/*      setIsSending(false);*/}
          {/*    }*/}
          {/*  }}*/}
          {/*  disabled={!userInput.trim() && !isSending} // Disable the button when input is empty or sending*/}
          {/*>*/}
          {/*  {isSending ? <>{buttonContent}</> : <>发送</>}*/}
          {/*</Button>*/}
        </div>
      </div>
    </div>
  );
};

export default Content;
