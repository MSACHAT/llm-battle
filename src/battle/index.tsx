import Title from "@douyinfe/semi-ui/lib/es/typography/title";
import "./index.scss";
import { BattleComponent } from "./components/BattleComponent";
import { Button, Input, Space, Spin } from "@douyinfe/semi-ui";
import { useState } from "react";
import { Message } from "@/interface";
import VoteComponent from "@/battle/components/voteComponent";
export const Battle = () => {
  const [text, setText] = useState("");
  const [controller, setController] = useState<any>(null);
  const [streamMessage_1, setStreamMessage_1] = useState("");
  const [streamMessage_2, setStreamMessage_2] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages_1, setMessages_1] = useState<Message[]>([]);
  const [messages_2, setMessages_2] = useState<Message[]>([]);
  const [newRoundLoading, setNewRoungLoading] = useState(false);
  const stopGenerate = () => {
    controller?.abort?.();
    if (streamMessage_1) {
      setMessages_1((msgs) =>
        msgs.concat([
          {
            type: "reply",
            id: msgs.length,
            content: streamMessage_1,
            createdAt: Date.now(),
          },
        ]),
      );
      setStreamMessage_1("");
    }
    if (streamMessage_2) {
      setMessages_2((msgs) =>
        msgs.concat([
          {
            type: "reply",
            id: msgs.length,
            content: streamMessage_2,
            createdAt: Date.now(),
          },
        ]),
      );
      setStreamMessage_2("");
    }
  };
  const newRound = async () => {
    stopGenerate();
    setNewRoungLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setController(null);
    setStreamMessage_1("");
    setMessages_1([]);
    setStreamMessage_2("");
    setMessages_2([]);
    setNewRoungLoading(false);
  };

  const sendTextChatMessages = async (content: string) => {
    // temp stream message
    const tempMessage = "";
    const input: Message[] = [
      {
        type: "query",
        content,
        createdAt: Date.now(),
        id: messages_1.length,
      },
    ];
    setMessages_1((msg) => msg.concat(input));
    setMessages_2((msg) => msg.concat(input));
    setText("");
    setLoading(true);

    try {
      const abortController = new AbortController();
      setController(abortController);
      const res = await fetch("http://172.10.21.42:8087/api/battle/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Host: "api.coze.com",
          Connection: "keep-alive",
        },
        body: JSON.stringify({
          content_type: "text",
          conversation_id: "1",
          query: content,
        }),
        signal: abortController.signal,
      });

      const stream = res.body;

      const reader = stream?.getReader();

      let tempMessage1 = "";
      let tempMessage2 = "";
      const decoder = new TextDecoder();
      let shouldBreak = false; // 标志位
      const oneFinish = false;
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
              console.log(
                "Parsed object:",
                obj,
                obj.event === "done",
                !oneFinish,
              );
              if (obj.event === "done") {
                shouldBreak = true;
                return;
              }
              if (obj.message.content && obj.message.model === "model_a") {
                tempMessage1 += obj.message.content;
                console.log("Updated tempMessage:", tempMessage1);
                setStreamMessage_1(tempMessage1);
              } else {
                tempMessage2 += obj.message.content;
                console.log("Updated tempMessage:", tempMessage2);
                setStreamMessage_2(tempMessage2);
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
      const newMessage1 = {
        content: tempMessage1,
        createdAt: now,
        id: messages_1.length,
      };
      const newMessage2 = {
        content: tempMessage2,
        createdAt: now,
        id: messages_2.length,
      };
      setMessages_1((prevMessages) => {
        return prevMessages.concat([
          { ...newMessage1, type: "reply", id: prevMessages.length },
        ]);
      });
      setMessages_2((prevMessages) => {
        return prevMessages.concat([
          { ...newMessage2, type: "reply", id: prevMessages.length },
        ]);
      });
      setStreamMessage_1("");
      setStreamMessage_2("");
      tempMessage1 = "";
      tempMessage2 = "";
    } catch (e: any) {
      // abort manually or not
      if (!tempMessage) {
        if (e.name === "AbortError") {
          setMessages_1((msgs) =>
            msgs.concat([
              {
                type: "reply",
                id: msgs.length,
                content: `停止输出`,
                createdAt: Date.now(),
              },
            ]),
          );
          setMessages_2((msgs) =>
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
          setMessages_1((msgs) =>
            msgs.concat([
              {
                type: "reply",
                id: msgs.length,
                content: `Error: ${e.message || e.stack || e}`,
                createdAt: Date.now(),
              },
            ]),
          );
          setMessages_2((msgs) =>
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
  const Battles = () => (
    <div className={"battles"}>
      <BattleComponent
        messages={messages_1}
        streamMessage={streamMessage_1}
        loading={loading}
        title={"模型A"}
      />
      <BattleComponent
        messages={messages_2}
        streamMessage={streamMessage_2}
        loading={loading}
        title={"模型B"}
      />
    </div>
  );
  return (
    <div className={"battle-page"}>
      <Title heading={4}>开始对战</Title>
      {newRoundLoading ? (
        <Spin>
          <Battles />
        </Spin>
      ) : (
        <Battles />
      )}
      {messages_1.filter((x) => x.type === "reply").length > 0 && (
        <VoteComponent />
      )}
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
      <div className={"new-round"}>
        <Button theme="solid" onClick={newRound}>
          开始新一轮
        </Button>
      </div>
    </div>
  );
};
