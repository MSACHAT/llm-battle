import Title from "@douyinfe/semi-ui/lib/es/typography/title";
import "./index.scss";
import { BattleComponent } from "@/battle/index_2";
import { Input, Space } from "@douyinfe/semi-ui";
import { useState } from "react";
import { Message } from "@/interface";
export const Battle = () => {
  const [text, setText] = useState("");
  const [controller, setController] = useState<any>(null);
  const [streamMessage, setStreamMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
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
  const sendTextChatMessages = async (content: string) => {
    // temp stream message
    const tempMessage = "";
    console.log(tempMessage, 11111);
    const input: Message[] = [
      {
        type: "query",
        content,
        createdAt: Date.now(),
        id: messages.length,
      },
    ];
    setMessages((msg) => msg.concat(input));
    setText("");
    setLoading(true);

    try {
      const abortController = new AbortController();
      setController(abortController);
      const res = await fetch("https://api.coze.cn/open_api/v2/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer pat_yzumqWcV3NgGMHYSEW05brcVUfZgAklWQheAzLDv04QZf1jHFnp0doL7598g3zqG",

          Accept: "*/*",
          Host: "api.coze.cn",
          Connection: "keep-alive",
        },
        body: JSON.stringify({
          // content_type: "text",
          conversation_id: "1",
          query: content,
          stream: true,
          user: "1",
          bot_id: "7341000200011546658",
        }),
        signal: abortController.signal,
      });

      const stream = res.body;

      const reader = stream?.getReader();

      let tempMessage = "";
      const decoder = new TextDecoder();
      let shouldBreak = false; // 标志位

      // eslint-disable-next-line no-constant-condition
      while (true) {
        console.log("Starting loop iteration");
        const { value, done } = await reader!.read();

        if (value) {
          const decodedValue = decoder.decode(value);
          console.log("Decoded value:", decodedValue);

          // 分割和处理数据包
          const dataPackets = decodedValue
            .split("\ndata:")
            .map((packet) => packet.trim())
            .filter((packet) => packet);

          dataPackets.forEach((packet) => {
            if (shouldBreak) return; // 如果标志位为真，退出 forEach 循环

            console.log("Raw packet:", packet);

            try {
              // 如果数据包前面有 'data:' 前缀，去掉它
              const jsonString = packet.startsWith("data:")
                ? packet.slice(5).trim()
                : packet.trim();
              const obj = JSON.parse(jsonString);
              console.log("Parsed object:", obj);

              if (obj.is_finish) {
                console.log("Received is_finish, setting shouldBreak to true");
                shouldBreak = true; // 设置标志位为真
                return; // 退出 forEach 循环
              }

              if (obj.message.content) {
                tempMessage += obj.message.content;
                console.log("Updated tempMessage:", tempMessage);
                setStreamMessage(tempMessage);
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

          if (shouldBreak) break; // 如果标志位为真，退出 while 循环
        }

        if (done) {
          console.log("Done reading, breaking loop");
          break;
        }
      }

      const now = Date.now();
      const newMessage = {
        content: tempMessage,
        createdAt: now,
        id: messages.length,
      };
      setMessages((prevMessages) => {
        return prevMessages.concat([
          { ...newMessage, type: "reply", id: prevMessages.length },
        ]);
      });
      setStreamMessage("");
      tempMessage = "";
    } catch (e: any) {
      // abort manually or not
      if (!tempMessage) {
        if (e.name === "AbortError") {
          setMessages((msgs) =>
            msgs.concat([
              {
                type: "reply",
                id: msgs.length,
                content: `停止输出`,
                createdAt: Date.now(),
              },
            ]),
          );
        } else {
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
      }
    } finally {
      setController(null);
      setLoading(false);
    }
  };
  return (
    <div className={"battle-page"}>
      <Title heading={4}>开始对战</Title>
      <div className={"battles"}>
        <BattleComponent
          messages={messages}
          streamMessage={streamMessage}
          loading={loading}
          title={"模型A"}
        />
        <BattleComponent
          messages={messages}
          streamMessage={streamMessage}
          loading={loading}
          title={"模型B"}
        />
      </div>
      <Input
        autoFocus
        placeholder={
          "在这里输入问题，按Enter发送，你会得到AB模型的不同答案并可以为它们投票"
        }
        value={text}
        onChange={(v) => setText(v)}
        onEnterPress={async () => {
          stopGenerate();
          await new Promise((resolve) => setTimeout(resolve, 100)); // 等待下一个事件循环
          sendTextChatMessages(text);
        }}
      />
    </div>
  );
};
