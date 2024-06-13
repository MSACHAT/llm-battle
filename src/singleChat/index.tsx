import { Avatar, Button, Input, TextArea } from "@douyinfe/semi-ui";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Chat, LeftNavBar } from "./LeftNavBar/LeftNavBar";
import "./index.scss";
import { ModelSelector } from "./ModelSelector/index";
import apiClient from "@/middlewares/axiosInterceptors";

type ChatMessage = {
  content: string;
  content_type: string;
  message_id: string;
  role: "user" | "bot";
};

interface ApiResponse {
  conversation_id: string;
}

interface MessageListResponse {
  data: ChatMessage[];
  totalPages: number;
}

interface MessageContextType {
  botModel: string;
  setBotModel: (message: string) => void;
}

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

export const HandleClickOnChatBlockContext = React.createContext(
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  (conversation_id: string) => {},
);
export const StartNewChatContext = React.createContext(
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
);
export const BotModelContext = React.createContext<MessageContextType>({
  botModel: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setBotModel: () => {},
});
export const SingleChat = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const [buttonContent, setButtonContent] = useState("发送");
  const isSendingRef = useRef(isSending); // 创建一个ref来跟踪isSending的值
  const canAutoScrollRef = useRef(true);
  const [moreChatHistory, setMoreChatHistory] = useState<ChatMessage[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const currConversationId = useRef<undefined | string>(undefined);
  const isNewChat = useRef(false);
  const [pageNum, setPageNum] = useState(0);
  const totalPages = useRef(0);
  const [botModel, setBotModel] = useState<string>("");
  useEffect(() => {
    apiClient
      .get("http://172.10.21.42:8087/api/conversations")
      .then(async (res) => {
        const data = res as unknown as Chat[];
        console.log(data);
        if (data.length === 0) {
          isNewChat.current = true;
          setChats([
            {
              title: "New Chat",
              conversation_id: "",
              last_message_time: NaN,
              bot_name: "",
            },
          ]);
        } else {
          console.log("NOT A NEW CHAT !");
          isNewChat.current = false;
          currConversationId.current = data
            .sort((a, b) => b.last_message_time - a.last_message_time)
            .at(0)?.conversation_id;
          setChats(data);
          console.log(currConversationId.current);
          const res = await apiClient.get(
            `http://172.10.21.42:8087/api/conversation/${currConversationId.current}/get_message_list?pageSize=10&pageNum=${pageNum}`,
          );
          console.log(res);
          const resData = res as unknown as MessageListResponse;
          if (resData) {
            setMoreChatHistory(resData.data);
            totalPages.current = resData.totalPages;
          }
        }
      });
  }, []);

  function handleClickOnChatBlock(conversation_id: string) {
    if (isNewChat.current) {
      setChats(
        chats.filter((chat) => {
          return chat.conversation_id !== "";
        }),
      );
    }
    currConversationId.current = conversation_id;
    console.log(conversation_id);
    setIsSending(false);
    setPageNum(0);
    apiClient
      .get(
        `http://172.10.21.42:8087/api/conversation/${currConversationId.current}/get_message_list?pageSize=10&pageNum=0`,
      )
      .then((res) => {
        console.log(res);
        if (res.data) {
          setMoreChatHistory(res.data);
          // totalPages.current = res.totalPages;
          setPageNum((prevState) => prevState + 1);
        } else {
          setMoreChatHistory([]);
        }
      });
  }

  function startNewChat() {
    if (!isNewChat.current) {
      localStorage.setItem("current_model_name", "");
      setChatHistory([]);
      setUserInput("");
      setIsSending(false);
      isNewChat.current = true;
      setChats([
        {
          title: "New Chat",
          conversation_id: "",
          last_message_time: NaN,
          bot_name: "",
        },
        ...chats,
      ]);
    }
  }

  function fetchData() {
    console.log("FETCHDATA");
    console.log(totalPages.current);
    console.log(pageNum);
    canAutoScrollRef.current = false;
    let newData = [...moreChatHistory];
    apiClient
      .get(
        `http://172.10.21.42:8087/api/conversation/${currConversationId.current}/get_message_list?pageSize=10&pageNum=${pageNum}`,
      )
      .then((res) => {
        if (res.data) {
          newData = [...res.data, ...newData];
          setTimeout(() => setMoreChatHistory(newData), 1500);
          setPageNum((prevState) => prevState + 1);
        } else {
          setPageNum((prevState) => prevState + 1);
        }
      });
  }

  const query = async (msg: string) => {
    try {
      setIsSending(true);
      setButtonContent("终止输出");
      const res = await fetch(
        "http://172.10.21.42:8087/api/conversation/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Connection: "keep-alive",
          },
          body: JSON.stringify({
            content_type: "text",
            conversation_id: currConversationId.current,
            query: msg,
          }),
        },
      );

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
      const stream = new ReadableStream({
        async start(controller) {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const decodedValue = decoder.decode(value, { stream: true });
            console.log(decodedValue);
            // 处理拆分数据包，确保每个数据包都完整处理
            const dataPackets = decodedValue
              .split("\ndata:")
              .map((packet) => packet.trim())
              .filter((packet) => packet);

            dataPackets.forEach((packet) => {
              try {
                const jsonString = packet.startsWith("data:")
                  ? packet.slice(5).trim()
                  : packet;
                const obj = JSON.parse(jsonString);

                if (!obj.is_finish) {
                  currentReply += obj.message.content;
                  setChatHistory((prevHistory) => {
                    const updatedHistory = [...prevHistory];
                    const lastMessage =
                      updatedHistory[updatedHistory.length - 1];
                    if (lastMessage && lastMessage.role === "bot") {
                      updatedHistory[updatedHistory.length - 1] = {
                        ...lastMessage,
                        content: currentReply,
                      };
                    } else {
                      updatedHistory.push({
                        content_type: "",
                        message_id: "0",
                        content: currentReply,
                        role: "bot",
                      });
                    }
                    return updatedHistory;
                  });
                } else {
                  clearTimeout(timeoutRef.current!);
                  setIsSending(false);
                  setButtonContent("发送");
                  controller.close();
                  return;
                }
              } catch (error) {
                console.error(
                  "JSON parsing error:",
                  error,
                  "Packet causing error:",
                  packet,
                );
              }
            });
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
    isSendingRef.current = isSending;
  }, [isSending]);

  useEffect(() => {
    return () => {
      if (isSendingRef.current) {
        console.log("发送终止请求");
      }
    };
  }, []);

  return (
    <div className={"single-chat"}>
      <HandleClickOnChatBlockContext.Provider value={handleClickOnChatBlock}>
        <StartNewChatContext.Provider value={startNewChat}>
          <BotModelContext.Provider value={{ botModel, setBotModel }} />
          <LeftNavBar
            chats={chats}
            chosenChatId={isNewChat.current ? "" : currConversationId.current}
          />
        </StartNewChatContext.Provider>
      </HandleClickOnChatBlockContext.Provider>
      <div className={"single-chat-content"}>
        <div style={{ alignSelf: "center" }}>
          {" "}
          {isNewChat.current || chats.length === 0 ? <ModelSelector /> : <></>}
        </div>
        <div className={"chat-history-list"} id="chat-history-list">
          <InfiniteScroll
            endMessage={"没有更多数据了"}
            dataLength={moreChatHistory.length}
            scrollableTarget={"chat-history-list"}
            loader={<p className="text-center m-5">⏳&nbsp;Loading...</p>}
            inverse={true}
            hasMore={pageNum <= totalPages.current}
            next={fetchData}
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              overflow: "visible",
            }}
          >
            <div ref={bottomRef} />
            <div className={"chat-history-list-content"}>
              <div className={"more-chat-history"}>
                {[...moreChatHistory].reverse().map((record) => {
                  if (record.role === "user") {
                    return <UserQuery query={record.content} />;
                  } else {
                    return <BotReply reply={record.content} />;
                  }
                })}
              </div>
              {chatHistory.map((record) => {
                if (record.role === "user") {
                  return <UserQuery query={record.content} />;
                } else {
                  return <BotReply reply={record.content} />;
                }
              })}
            </div>
          </InfiniteScroll>
        </div>
        <div className={"user-input"}>
          <TextArea
            autosize
            rows={1}
            autoFocus
            value={userInput}
            onChange={(value: string) => setUserInput(value)}
          ></TextArea>
          <Button
            className={"send-button"}
            theme="solid"
            onClick={() => {
              if (!isSending) {
                const currModelName =
                  localStorage.getItem("current_model_name");
                canAutoScrollRef.current = true;
                setChatHistory((prevHistory) => [
                  ...prevHistory,
                  {
                    content: userInput,
                    role: "user",
                    message_id: "",
                    content_type: "text",
                  },
                ]);
                setUserInput("");
                if (isNewChat.current && currModelName) {
                  setBotModel(currModelName);
                  console.log(currModelName);
                  apiClient
                    .post(
                      "http://172.10.21.42:8087/api/conversation/create_conversation",
                      { model_name: currModelName },
                    )
                    .then((res) => {
                      const data = res as unknown as ApiResponse;
                      currConversationId.current = data.conversation_id;
                      query(userInput);
                    });
                } else {
                  query(userInput);
                }
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
