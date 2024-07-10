import React, { useEffect, useRef, useState } from "react";
import { Chat, LeftNavBar } from "./LeftNavBar/LeftNavBar";
import "./index.scss";
import apiClient from "@/middlewares/axiosInterceptors";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { ChatBox } from "@/singleChat/ChatBox";
import { Toast } from "@douyinfe/semi-ui";

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
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const DeleteChatContext = React.createContext(() => {});
export const SingleChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const isNewChatRef = useRef(false);
  const [isNewChat, setIsNewChat] = useState(false);
  const [botModel, setBotModel] = useState<string>("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversation_id, setConversation_id] = useState<string>();
  const [modelName, setModelName] = useState<string>();
  const [cacheConversationId, setCacheConversationId] = useState("");
  useEffect(() => {
    // 获取url信息
    const chatId = searchParams.get("chat_id") || "";
    setConversation_id(chatId);
    const modelNameFromUrl = decodeURIComponent(
      searchParams.get("model_name") || "",
    );
    setModelName(modelNameFromUrl);

    // 请求聊天列表

    apiClient
      .get<Chat[]>(`/api/conversations`)
      .then(async (res) => {
        let c;
        const data = res;
        if (data.length === 0) {
          //处理没有聊天记录的情况
          isNewChatRef.current = true;
          c = [
            {
              title: "New Chat",
              conversation_id: "new",
              last_message_time: NaN,
              bot_name: modelNameFromUrl,
            },
          ];
        } else {
          if (chatId === "new") {
            c = [
              {
                title: "New Chat",
                conversation_id: "new",
                last_message_time: NaN,
                bot_name: modelNameFromUrl,
              },
              ...data,
            ];
          } else {
            c = data;
          }
        }
        if (!modelName) {
          const m = c.find((x) => x.conversation_id === chatId)?.bot_name;
          console.log(m);
          setModelName(m);
        }
        setChats(c);
      })
      .catch((err) => Toast.error(err.message));
  }, []);

  //把新建的conversation_id从new更新为正确id
  const changeNewChatId = () => {
    if (cacheConversationId) {
      const updatedChats = chats.map((chat) => {
        if (chat.conversation_id === "new") {
          return {
            ...chat,
            conversation_id: cacheConversationId,
          };
        } else {
          return chat;
        }
      });
      setCacheConversationId("");
      setConversation_id("");
      setChats(updatedChats);
      return updatedChats;
    }
    return chats;
  };

  function handleClickOnChatBlock(conversation_id: string, model: string) {
    //在切换其它对话的时候把新建的conversation_id从new更新为正确id
    changeNewChatId();
    setIsNewChat(false);
    setConversation_id(conversation_id);
    setModelName(model);
    navigate(`/singleChat?chat_id=${conversation_id}`);
  }

  async function startNewChat() {
    //在新建聊天时将之前新建的conversation_id从new更新为正确id
    const chats_t = changeNewChatId();
    if (chats_t[0]?.conversation_id == "new") {
      Toast.info("当前已是新聊天");
      return;
    }
    if (!modelName) {
      navigate(`/singleChat?chat_id=new`);
    }
    await new Promise((resolve) => setTimeout(resolve, 100)); // 等待下一个事件循环
    if (chats_t[0]?.conversation_id !== "new") {
      setIsNewChat(true);
      setConversation_id("new");
      setModelName("");
      setChats([
        {
          title: "New Chat",
          conversation_id: "new",
          last_message_time: NaN,
          bot_name: "",
        },
        ...chats_t,
      ]);
    }
  }

  const updateNewConversation = (
    conversation_id: string,
    newTitle: string,
    new_model_name: string,
  ) => {
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
    setCacheConversationId(conversation_id);
    setChats(updatedChats);
  };

  const deleteChat = () => {
    setChats(
      chats.filter((chat) => {
        return chat.conversation_id !== conversation_id;
      }),
    );
    setConversation_id("");
  };
  return (
    <div className={"single-chat"}>
      <HandleClickOnChatBlockContext.Provider value={handleClickOnChatBlock}>
        <StartNewChatContext.Provider value={startNewChat}>
          <BotModelContext.Provider value={{ botModel, setBotModel }} />
          <DeleteChatContext.Provider value={deleteChat}>
            <LeftNavBar
              chats={chats}
              chosenChatId={conversation_id}
              key={chats.map((x) => x.conversation_id).join()}
            />
          </DeleteChatContext.Provider>
        </StartNewChatContext.Provider>
      </HandleClickOnChatBlockContext.Provider>
      {conversation_id && (
        <ChatBox
          key={conversation_id}
          conversation_id={conversation_id}
          model_name={modelName}
          updateNewConversation={updateNewConversation}
          isNewChat={isNewChat}
        />
      )}
    </div>
  );
};
