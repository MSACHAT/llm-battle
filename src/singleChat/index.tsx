import React, { useEffect, useRef, useState } from "react";
import { Chat, LeftNavBar } from "./LeftNavBar/LeftNavBar";
import "./index.scss";
import apiClient from "@/middlewares/axiosInterceptors";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { ChatBox } from "@/singleChat/ChatBox";

type ChatMessage = {
  content: string;
  content_type: string;
  message_id: string;
  role: "user" | "bot";
};

interface MessageListResponse {
  data: ChatMessage[];
  totalPages: number;
}

interface MessageContextType {
  botModel: string;
  setBotModel: (message: string) => void;
}

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
  const [chats, setChats] = useState<Chat[]>([]);
  const isNewChat = useRef(false);
  const [botModel, setBotModel] = useState<string>("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversation_id, setConversation_id] = useState<null | string>();
  const [modelName, setModelName] = useState<string | null>();

  //请求聊天列表
  useEffect(() => {
    const chatId = searchParams.get("chat_id");
    const modelNameFromUrl = searchParams.get("model_name");
    if (chatId) {
      // url指定会话
      setConversation_id(chatId);
    } else {
      // url指定新model
      setModelName(modelNameFromUrl);
    }

    //请求聊天列表
    apiClient.get<Chat[]>(`/api/conversations`).then(async (res) => {
      const data = res;
      if (data.length === 0) {
        //处理没有聊天记录的情况
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
        if (modelNameFromUrl) {
          setChats([
            ...data,
            {
              title: "New Chat",
              conversation_id: "",
              last_message_time: NaN,
              bot_name: "",
            },
          ]);
        } else {
          setChats(data);
        }
      }
    });
  }, []);

  //TODO 处理添加新对话
  // useEffect(() => {
  //   if (
  //     chats &&
  //     chats[0]?.conversation_id !== "" &&
  //     conversation_id == "new" &&
  //     model_name
  //   ) {
  //     setChats([
  //       {
  //         title: "New Chat",
  //         conversation_id: "",
  //         last_message_time: NaN,
  //         bot_name: "",
  //       },
  //       ...chats,
  //     ]);
  //     isNewChat.current = true;
  //   }
  // }, [chats]);

  function handleClickOnChatBlock(conversation_id: string) {
    setConversation_id(conversation_id);
    navigate(`/singleChat?chat_id=${conversation_id}`);
  }

  function startNewChat() {
    if (!modelName) {
      navigate(`/singleChat?chat_id=new`);
    }
    if (!isNewChat.current) {
      // localStorage.setItem("current_model_name", "");

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
  console.log(conversation_id, 111);
  return (
    <div className={"single-chat"}>
      <HandleClickOnChatBlockContext.Provider value={handleClickOnChatBlock}>
        <StartNewChatContext.Provider value={startNewChat}>
          <BotModelContext.Provider value={{ botModel, setBotModel }} />
          <LeftNavBar
            chats={chats}
            chosenChatId={isNewChat.current ? "" : conversation_id}
          />
        </StartNewChatContext.Provider>
      </HandleClickOnChatBlockContext.Provider>
      <ChatBox conversation_id={conversation_id!} />
    </div>
  );
};
