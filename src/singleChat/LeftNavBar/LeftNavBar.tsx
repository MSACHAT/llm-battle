import "./LeftNavBar.scss";
import { Button, Image, Input, Popover, Space } from "@douyinfe/semi-ui";
import { RefObject, useContext, useEffect, useState } from "react";
import { HandleClickOnChatBlockContext, StartNewChatContext } from "../index";
import { IconDelete, IconEdit } from "@douyinfe/semi-icons";
import apiClient from "../../middlewares/axiosInterceptors";

export type Chat = {
  conversation_id: string;
  title: string;
  last_message_time: number;
  bot_name: string;
};

export const LeftNavBar = ({
  chats,
  chosenChatId,
}: {
  chats: Chat[];
  chosenChatId: string | undefined | null;
}) => {
  const [currChats, setCurrChats] = useState<Chat[]>([]);
  useEffect(() => {
    setCurrChats(chats);
  }, [chats]);
  const [currChatId, setCurrChatId] = useState(chosenChatId);
  const isChosen = (conversationId: string) => {
    return conversationId === currChatId;
  };

  const NewChatButton = () => {
    const startNewChat = useContext(StartNewChatContext);
    const handleClick = () => {
      startNewChat();
      setCurrChatId("new");
    };
    return (
      <Button onClick={handleClick} className={"new-chat-button"}>
        新建聊天
      </Button>
    );
  };

  const ChatBlock = ({
    chatTitle,
    chatModel,
    chosen,
    conversation_id,
  }: {
    chatTitle: string;
    chatModel: string;
    chosen: boolean;
    conversation_id: string;
  }) => {
    const renderEditTitle = ({
      initialFocusRef,
    }: {
      initialFocusRef?: RefObject<HTMLElement>;
    }) => {
      return (
        <div style={{ padding: 12 }}>
          <Space>
            <Input
              onChange={setInputTitle}
              ref={initialFocusRef as RefObject<HTMLInputElement>}
              placeholder={title}
              onEnterPress={() => {
                setEditPopOver(false);
                setTitle(inputTitle);
                setCurrChats(
                  currChats.map((chat) => {
                    if (chat.conversation_id === conversation_id) {
                      return {
                        ...chat,
                        title: inputTitle,
                      };
                    }
                    return chat;
                  }),
                );
                console.log(inputTitle);
                console.log(conversation_id);
                apiClient.patch(`/api/conversation/title`, {
                  conversation_id: conversation_id,
                  title: inputTitle,
                });
              }}
            />
          </Space>
        </div>
      );
    };
    const renderDeleteChat = ({
      initialFocusRef,
    }: {
      initialFocusRef?: RefObject<HTMLElement>;
    }) => {
      return (
        <div style={{ padding: 12 }}>
          <Space>
            <Button
              onClick={() => {
                setDeletePopOver(false);
                setCurrChats(
                  currChats.filter((chat) => {
                    return chat.conversation_id !== conversation_id;
                  }),
                );
                apiClient.delete(`/api/conversation/${conversation_id}`);
              }}
            >
              确定删除
            </Button>
          </Space>
        </div>
      );
    };
    const [inputTitle, setInputTitle] = useState("");
    const [title, setTitle] = useState(chatTitle);
    const [model, setChatModel] = useState(chatModel);
    const handleClick = useContext(HandleClickOnChatBlockContext);
    const [editPopOver, setEditPopOver] = useState(false);
    const [deletePopOver, setDeletePopOver] = useState(false);
    return (
      <div
        className={"chat-block-root"}
        onClick={() => {
          if (!isChosen(conversation_id)) {
            handleClick(conversation_id);
            setCurrChatId(conversation_id);
          }
        }}
      >
        <div className={"chat-block" + (chosen ? " chat-block-chosen" : "")}>
          <div className={"icon-and-title"}>
            <Image
              className={"comment-icon"}
              src={"/comment_icon.png"}
              width={24}
              height={24}
            />
            <div className="title"> {title}</div>
          </div>
          <div className={"operations"}>
            <Popover
              content={renderEditTitle}
              trigger="custom"
              visible={editPopOver}
            >
              <Button
                onClick={() => {
                  setEditPopOver(!editPopOver);
                }}
                className={"pencil-icon"}
                icon={<IconEdit style={{ color: "white" }} />}
              />
            </Popover>
            <Popover
              content={renderDeleteChat}
              trigger="custom"
              visible={deletePopOver}
            >
              <Button
                className={"rubbish-bin-icon"}
                icon={<IconDelete style={{ color: "white" }} />}
                onClick={() => {
                  setDeletePopOver(!deletePopOver);
                }}
              />
            </Popover>
          </div>
        </div>
        <div className={"model-source"}>模型来源: {model}</div>
      </div>
    );
  };

  return (
    <div className={"left-nav-bar"}>
      <div className={"chat-block-list"}>
        {currChats.map((chat: Chat) => {
          return (
            <ChatBlock
              key={chat.conversation_id}
              chatTitle={chat.title}
              chatModel={chat.bot_name}
              chosen={isChosen(chat.conversation_id)}
              conversation_id={chat.conversation_id}
            />
          );
        })}
      </div>
      <div className={"chat-button-sector"}>
        <NewChatButton />
      </div>
    </div>
  );
};
