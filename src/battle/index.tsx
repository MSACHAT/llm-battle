import Title from "@douyinfe/semi-ui/lib/es/typography/title";
import "./index.scss";
import { BattleComponent } from "./components/BattleComponent";
import { Button, Input, Space, Spin } from "@douyinfe/semi-ui";
import { useState, useCallback } from "react";
import { Message } from "@/interface";
import VoteComponent from "@/battle/components/voteComponent";

export const Battle = () => {
  const [text, setText] = useState("");
  const [controller, setController] = useState<any>(null);
  const [streamMessages, setStreamMessages] = useState<{
    [key: string]: string;
  }>({
    model_a: "",
    model_b: "",
  });
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({
    model_a: [],
    model_b: [],
  });
  const [newRoundLoading, setNewRoundLoading] = useState(false);

  const stopGenerate = useCallback(() => {
    controller?.abort?.();
    setMessages((msgs) => {
      const newMessages = { ...msgs };
      ["model_a", "model_b"].forEach((model) => {
        if (streamMessages[model]) {
          newMessages[model] = msgs[model].concat([
            {
              type: "reply",
              id: msgs[model].length,
              content: streamMessages[model],
              createdAt: Date.now(),
            },
          ]);
          setStreamMessages((prev) => ({ ...prev, [model]: "" }));
        }
      });
      return newMessages;
    });
  }, [controller, streamMessages]);

  const newRound = async () => {
    stopGenerate();
    setNewRoundLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setController(null);
    setStreamMessages({ model_a: "", model_b: "" });
    setMessages({ model_a: [], model_b: [] });
    setNewRoundLoading(false);
  };

  const sendTextChatMessages = async (content: string) => {
    const input: Message = {
      type: "query",
      content,
      createdAt: Date.now(),
      id: messages.model_a.length,
    };

    setMessages((msg) => ({
      model_a: msg.model_a.concat(input),
      model_b: msg.model_b.concat(input),
    }));
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
      const decoder = new TextDecoder();
      const tempMessages = { model_a: "", model_b: "" };
      let shouldBreak = false;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader!.read();
        if (value) {
          const decodedValue = decoder.decode(value);
          const dataPackets = decodedValue
            .split("\ndata:")
            .map((packet) => packet.trim())
            .filter((packet) => packet);

          dataPackets.forEach((packet) => {
            if (shouldBreak) return;

            try {
              const jsonString = packet.startsWith("data:")
                ? packet.slice(5).trim()
                : packet.trim();
              const obj = JSON.parse(jsonString);
              if (obj.event === "done") {
                shouldBreak = true;
                return;
              }
              const modelKey = obj.model === "model_a" ? "model_a" : "model_b";
              tempMessages[modelKey] += obj.message.content;
              setStreamMessages((prev) => ({
                ...prev,
                [modelKey]: tempMessages[modelKey],
              }));
            } catch (error) {
              console.error(
                "JSON parsing error:",
                error,
                "Packet causing error:",
                packet,
              );
            }
          });

          if (shouldBreak) break;
        }

        if (done) break;
      }

      const now = Date.now();
      const newMessages = {
        model_a: {
          content: tempMessages.model_a,
          createdAt: now,
          id: messages.model_a.length,
        },
        model_b: {
          content: tempMessages.model_b,
          createdAt: now,
          id: messages.model_b.length,
        },
      };
      setMessages((prevMessages) => ({
        model_a: prevMessages.model_a.concat({
          ...newMessages.model_a,
          type: "reply",
        }),
        model_b: prevMessages.model_b.concat({
          ...newMessages.model_b,
          type: "reply",
        }),
      }));
      setStreamMessages({ model_a: "", model_b: "" });
    } catch (e: any) {
      const error = `Error: ${e.message || e.stack || e}`;
      const errorMessage = {
        id: messages.model_a.length,
        content: error,
        createdAt: Date.now(),
      };
      setMessages((msgs) => ({
        model_a: msgs.model_a.concat({ ...errorMessage, type: "reply" }),
        model_b: msgs.model_b.concat({ ...errorMessage, type: "reply" }),
      }));
    } finally {
      setController(null);
      setLoading(false);
    }
  };

  const Battles = () => (
    <div className={"battles"}>
      <BattleComponent
        messages={messages.model_a}
        streamMessage={streamMessages.model_a}
        loading={loading}
        title={"模型A"}
      />
      <BattleComponent
        messages={messages.model_b}
        streamMessage={streamMessages.model_b}
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
      {messages.model_a.filter((x) => x.type === "reply").length > 0 && (
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
