import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chat, LeftNavBar } from "./LeftNavBar/LeftNavBar";
import "./index.scss";
import apiClient from "@/middlewares/axiosInterceptors";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { ChatBox } from "@/singleChat/ChatBox";

interface MessageContextType {
  botModel: string;
  setBotModel: (message: string) => void;
}

export const HandleClickOnChatBlockContext = React.createContext(
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  (conversation_id: string, model: string) => {},
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
  const [conversation_id, setConversation_id] = useState<string>();
  const [modelName, setModelName] = useState<string>();

  useEffect(() => {
    // 获取url信息
    const chatId = searchParams.get("chat_id") || "";
    setConversation_id(chatId);
    const modelNameFromUrl = decodeURIComponent(
      searchParams.get("model_name") || "",
    );
    setModelName(modelNameFromUrl);

    // 请求聊天列表
    apiClient.get<Chat[]>(`/api/conversations`).then(async (res) => {
      const data = res;
      if (data.length === 0) {
        //处理没有聊天记录的情况
        isNewChat.current = true;
        setChats([
          {
            title: "New Chat",
            conversation_id: "new",
            last_message_time: NaN,
            bot_name: modelNameFromUrl,
          },
        ]);
      } else {
        if (chatId === "new") {
          setChats([
            {
              title: "New Chat",
              conversation_id: "new",
              last_message_time: NaN,
              bot_name: modelNameFromUrl,
            },
            ...data,
          ]);
        } else {
          setChats(data);
        }
      }
    });
  }, []);

  function handleClickOnChatBlock(conversation_id: string, model: string) {
    setConversation_id(conversation_id);
    setModelName(model);
    navigate(`/singleChat?chat_id=${conversation_id}`);
  }

  function startNewChat() {
    if (!modelName) {
      navigate(`/singleChat?chat_id=new`);
    }
    setConversation_id("new");
    setModelName("");
    setChats([
      {
        title: "New Chat",
        conversation_id: "new",
        last_message_time: NaN,
        bot_name: "",
      },
      ...chats,
    ]);
  }

  const updateNewConversation = (newTitle: string, new_model_name: string) => {
    const updatedChats = chats.map((chat) => {
      if (chat.conversation_id === "new") {
        return {
          ...chat,
          title: newTitle,
          bot_name: new_model_name,
        };
      } else {
        return chat;
      }
    });
    console.log(newTitle, new_model_name, chats);
    setChats(updatedChats);
  };

  return (
    <div className={"single-chat"}>
      <HandleClickOnChatBlockContext.Provider value={handleClickOnChatBlock}>
        <StartNewChatContext.Provider value={startNewChat}>
          <BotModelContext.Provider value={{ botModel, setBotModel }} />
          <LeftNavBar chats={chats} chosenChatId={conversation_id} />
        </StartNewChatContext.Provider>
      </HandleClickOnChatBlockContext.Provider>
      {conversation_id && (
        <ChatBox
          key={conversation_id}
          conversation_id={conversation_id}
          model_name={modelName}
          updateNewConversation={updateNewConversation}
        />
      )}
    </div>
  );
};
