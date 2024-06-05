import { FC, useState } from "react";
import MessageBox from "./MessageBox";
import { Message, ReactSetState } from "@/interfaces";
import { Input } from "@douyinfe/semi-ui";
import axios from "axios";
interface ContentProps {
  setActiveSetting: ReactSetState<boolean>;
}

const Content: FC<ContentProps> = ({ setActiveSetting }) => {
  // input text
  const [text, setText] = useState("");
  const [streamMessageMap, setStreamMessageMap] = useState<
    Record<string, string>
  >({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  // prompt
  const [showPrompt, setShowPrompt] = useState(false);

  // controller
  const [controller, setController] = useState<any>(null);

  // single conversation state
  const [conversation, setConversation] = useState({
    id: "1",
    messages: [] as Message[],
    mode: "text",
    title: "",
  });

  const { messages } = conversation;
  const { mode } = conversation;
  const streamMessage = streamMessageMap[conversation.id] ?? "";
  const loading = loadingMap[conversation.id];

  const updateMessages = (msgs: Message[]) => {
    setConversation((prev) => ({
      ...prev,
      updatedAt: msgs.slice(-1)?.[0]?.createdAt,
      messages: msgs,
      // If no title, set the first content
      title: prev.title || msgs[0].content,
    }));
  };
  const sendTextChatMessages = async (content: string) => {
    const current = conversation.id;
    // temp stream message
    let tempMessage = "";
    const input: Message[] = [
      {
        role: "user",
        content,
        createdAt: Date.now(),
      },
    ];
    const allMessages: Message[] = messages.concat(input);
    updateMessages(allMessages);
    setText("");
    setLoadingMap((map) => ({
      ...map,
      [current]: true,
    }));
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
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (value) {
          const char = decoder.decode(value);
          if (char === "\n" && tempMessage.endsWith("\n")) {
            continue;
          }
          if (char) {
            tempMessage += char;
            // eslint-disable-next-line no-loop-func
            setStreamMessageMap((map) => ({
              ...map,
              [current]: tempMessage,
            }));
          }
        }
        if (done) {
          break;
        }
      }
      updateMessages(
        allMessages.concat([
          {
            role: "assistant",
            content: tempMessage,
            createdAt: Date.now(),
          },
        ]),
      );
      setStreamMessageMap((map) => ({
        ...map,
        [current]: "",
      }));
      tempMessage = "";
    } catch (e: any) {
      // abort manually or not
      if (!tempMessage) {
        updateMessages(
          allMessages.concat([
            {
              role: "assistant",
              content: `Error: ${e.message || e.stack || e}`,
              createdAt: Date.now(),
            },
          ]),
        );
      }
    } finally {
      setController(null);
      setLoadingMap((map) => ({
        ...map,
        [current]: false,
      }));
    }
  };
  const stopGenerate = () => {
    controller?.abort?.();
    if (streamMessage) {
      updateMessages(
        messages.concat([
          {
            role: "assistant",
            content: streamMessage,
            createdAt: Date.now(),
          },
        ]),
      );
      setStreamMessageMap((map) => ({
        ...map,
        [conversation.id]: "",
      }));
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-auto common-scrollbar p-5 pb-0">
        <MessageBox
          streamMessage={streamMessage}
          messages={messages}
          mode={mode}
          loading={loading}
        />
      </div>
      <Input
        value={text}
        onChange={(v) => setText(v)}
        // streamMessage={streamMessage}
        onEnterPress={() => {
          sendTextChatMessages(text);
        }}
        // onCancel={stopGenerate}
        // loading={loading}
      />
    </div>
  );
};

export default Content;
