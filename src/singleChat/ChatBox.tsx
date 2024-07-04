import React, { useEffect, useRef, useState } from "react";
import { ModelSelector } from "@/singleChat/ModelSelector";
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar, Button, TextArea } from "@douyinfe/semi-ui";
import apiClient from "@/middlewares/axiosInterceptors";
import config from "@/config/config";
import Text from "@douyinfe/semi-ui/lib/es/typography/text";
type ChatMessage = {
  content: string;
  content_type: string;
  message_id: string;
  role: "user" | "bot";
};
interface ApiResponse {
  conversation_id: string;
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

export const ChatBox = ({
  conversation_id: conversation_id_origin,
  model_name,
}: {
  conversation_id?: string;
  model_name?: string;
}) => {
  const [userInput, setUserInput] = useState("");

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const canAutoScrollRef = useRef(true);
  const [moreChatHistory, setMoreChatHistory] = useState<ChatMessage[]>([]);
  const [pageNum, setPageNum] = useState(0);
  const totalPages = useRef(0);
  const [buttonContent, setButtonContent] = useState("发送");
  const isSendingRef = useRef(isSending); // 创建一个ref来跟踪isSending的值
  const bottomRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const [conversation_id, setConversation_id] = useState<string>(
    conversation_id_origin!,
  );
  const [isNewChat, setIsNewChat] = useState(
    model_name || conversation_id === "new",
  );

  useEffect(() => {
    if (canAutoScrollRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  useEffect(() => {
    isSendingRef.current = isSending;
  }, [isSending]);
  useEffect(() => {
    apiClient
      .get(
        `/api/conversation/${conversation_id}/get_message_list?pageSize=10&pageNum=0`,
      )
      .then((res: any) => {
        if (res.data) {
          console.log(res);
          setMoreChatHistory(res.data);
          setPageNum((prevState) => prevState + 1);
        } else {
          setMoreChatHistory([]);
        }
      });
  }, [conversation_id]);

  useEffect(() => {
    return () => {
      if (isSendingRef.current) {
        console.log("发送终止请求");
      }
    };
  }, []);
  function fetchData() {
    canAutoScrollRef.current = false;
    let newData = [...moreChatHistory];
    apiClient
      .get(
        `/api/conversation/${conversation_id}/get_message_list?pageSize=10&pageNum=${pageNum}`,
      )
      .then((res: any) => {
        if (res.data) {
          newData = [...res.data, ...newData];
          setTimeout(() => setMoreChatHistory(newData), 1500);
          setPageNum((prevState) => prevState + 1);
        } else {
          setPageNum((prevState) => prevState + 1);
        }
      });
  }

  const query = async (msg: string, conversation_id_new?: string) => {
    try {
      setIsSending(true);
      setButtonContent("终止输出");
      const res = await fetch(`${config.apiUrl}/api/conversation/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Connection: "keep-alive",
        },
        body: JSON.stringify({
          content_type: "text",
          conversation_id: conversation_id_new || conversation_id,
          query: msg,
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
      const stream = new ReadableStream({
        async start(controller) {
          // eslint-disable-next-line no-constant-condition
          while (isSendingRef.current) {
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

                if (!obj.is_finish && isSendingRef.current) {
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

  const sendMessage = () => {
    const currModelName = localStorage.getItem("current_model_name");
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
    if (conversation_id === "new") {
      //TODO 改新增的逻辑
      setIsNewChat(false);
      apiClient
        .post<ApiResponse>(`/api/conversation/create_conversation`, {
          model_name: currModelName,
        })
        .then((res) => {
          const data = res;
          setConversation_id(data.conversation_id);
          query(userInput, data.conversation_id);
        });
    } else {
      query(userInput);
    }
  };

  const handleKeyDown = async (event: {
    key: string;
    shiftKey: any;
    preventDefault: () => void;
  }) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // 阻止默认的换行行为
      if (!userInput) {
        return;
      }
      if (isSending) {
        setIsSending(false);
        await new Promise((resolve) => setTimeout(resolve, 100)); // 等待下一个事件循环
        sendMessage();
      } else {
        sendMessage();
      }
    }
  };
  return (
    <div className={"single-chat-content"}>
      <div style={{ alignSelf: "center" }}>
        {conversation_id === "new" ? (
          <ModelSelector defaultModel={model_name} />
        ) : (
          <Text type={"tertiary"}>{"当前模型：" + model_name}</Text>
        )}
      </div>
      <div className={"chat-history-list"} id="chat-history-list">
        <InfiniteScroll
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
              {[...moreChatHistory].map((record) => {
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
          autoFocus={true}
          value={userInput}
          onChange={(value: string) => setUserInput(value)}
          onEnterPress={isSending ? undefined : handleKeyDown}
        ></TextArea>
        <Button
          className={"send-button"}
          theme="solid"
          onClick={() => {
            if (!isSending) {
              isSendingRef.current = true;
              sendMessage();
            } else {
              setIsSending(false);
            }
          }}
          disabled={!userInput.trim() && !isSending} // Disable the button when input is empty or sending
        >
          {isSending ? <>{buttonContent}</> : <>发送</>}
        </Button>
      </div>
    </div>
  );
};
