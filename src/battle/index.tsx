import Title from "@douyinfe/semi-ui/lib/es/typography/title";
import "./index.scss";
import { BattleComponent } from "./components/BattleComponent";
import { Button, Space, Spin, TextArea } from "@douyinfe/semi-ui";
import { useState, useCallback } from "react";
import { Message, ModelModel } from "@/interface";
import VoteComponent from "@/battle/components/voteComponent";
import config from "@/config/config";
import { ModelText } from "@/component/utils";
import apiClient from "@/middlewares/axiosInterceptors";
interface StreamMessages {
  [key: string]: string;
}

interface Messages {
  [key: string]: Message[];
}
const models = ["model_a", "model_b"]; // 模型列表
export const Battle = () => {
  const [text, setText] = useState("");
  const [controller, setController] = useState<any>(null);
  const [streamMessages, setStreamMessages] = useState<StreamMessages>(
    models.reduce(
      (acc, model) => ({ ...acc, [model]: "" }),
      {} as StreamMessages,
    ),
  );
  const [answering, setAnswering] = useState(false);
  const [messages, setMessages] = useState<Messages>(
    models.reduce((acc, model) => ({ ...acc, [model]: [] }), {} as Messages),
  );
  const [newRoundLoading, setNewRoundLoading] = useState(false);
  const [modelNames, setModelNames] = useState(["模型A", "模型B"]);
  const [knownModels, setKnownModels] = useState<ModelModel[]>([
    { model_name: "chatgpt", _id: "1" },
    { model_name: "kimi", _id: "1" },
  ]);
  const [battle_id, setBattle_id] = useState("");
  const stopGenerate = useCallback(() => {
    controller?.abort?.();
    setMessages((msgs) => {
      const newMessages = { ...msgs };
      models.forEach((model) => {
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
    setStreamMessages(
      models.reduce((acc, model) => ({ ...acc, [model]: "" }), {}),
    );
    setMessages(models.reduce((acc, model) => ({ ...acc, [model]: [] }), {}));
    setNewRoundLoading(false);
    setKnownModels([]);
  };

  const create_battle = async () => {
    return await apiClient.post<string>("/api/battle/create").then((res) => {
      setBattle_id(res);
      return res;
    });
  };
  const sendTextChatMessages = async (content: string) => {
    let battle_id_t = battle_id;
    if (!battle_id_t) {
      battle_id_t = await create_battle();
    }
    const input: Message = {
      type: "query",
      content,
      createdAt: Date.now(),
      id: messages[models[0]].length, // Assuming all models have the same message length
    };

    setMessages((msg) => {
      const newMessages = { ...msg };
      models.forEach((model) => {
        newMessages[model] = msg[model].concat(input);
      });
      return newMessages;
    });
    setText("");
    setAnswering(true);

    try {
      const abortController = new AbortController();
      setController(abortController);
      const res = await fetch(config.apiUrl + "/api/battle/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Host: "api.coze.com",
          Connection: "keep-alive",
          Authorization: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          content_type: "text",
          battle_id_t,
          query: content,
        }),
        signal: abortController.signal,
      });

      const stream = res.body;
      const reader = stream?.getReader();
      const decoder = new TextDecoder();
      const tempMessages: StreamMessages = models.reduce(
        (acc, model) => ({ ...acc, [model]: "" }),
        {},
      );
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
              const modelKey = models.includes(obj.model)
                ? obj.model
                : models[0];
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
      const newMessages = models.reduce(
        (acc, model) => {
          acc[model] = {
            content: tempMessages[model],
            createdAt: now,
            id: messages[model].length,
            type: "reply",
          };
          return acc;
        },
        {} as { [key: string]: Message },
      );

      setMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        models.forEach((model) => {
          updatedMessages[model] = prevMessages[model].concat(
            newMessages[model],
          );
        });
        return updatedMessages;
      });
      setStreamMessages(
        models.reduce((acc, model) => ({ ...acc, [model]: "" }), {}),
      );
    } catch (e: any) {
      const error = `Error: ${e.message || e.stack || e}`;
      const errorMessage = {
        id: messages[models[0]].length,
        content: error,
        createdAt: Date.now(),
      };
      setMessages((msgs) => {
        const updatedMessages = { ...msgs };
        models.forEach((model) => {
          updatedMessages[model] = msgs[model].concat({
            ...errorMessage,
            type: "reply",
          });
        });
        return updatedMessages;
      });
    } finally {
      setController(null);
      setAnswering(false);
    }
  };

  const Battles = () => (
    <div className={"battles"}>
      {models.map((model, index) => (
        <BattleComponent
          key={index}
          messages={messages[model]}
          streamMessage={streamMessages[model]}
          loading={answering}
          title={
            <Space>
              <Title heading={6}>{modelNames[index]}</Title>
              <ModelText
                detail={{ text: knownModels?.[index] }}
                isTitle={true}
              />
            </Space>
          }
        />
      ))}
    </div>
  );

  return (
    <div className={"battle-page"}>
      <Title heading={5}>开始对战</Title>
      {newRoundLoading ? (
        <Spin>
          <Battles />
        </Spin>
      ) : (
        <Battles />
      )}
      {messages[models[0]].filter((x) => x.type === "reply").length > 0 && (
        <VoteComponent
          battle_id={battle_id}
          onVoteFinish={(models) => {
            setKnownModels(models);
          }}
        />
      )}
      <div className={"input-area"}>
        <TextArea
          autosize
          rows={1}
          autoFocus
          placeholder={
            "在这里输入问题，按回车键（Enter）发送，你会得到模型的不同答案并可以为它们投票"
          }
          value={text}
          onChange={(v) => setText(v)}
          onEnterPress={async () => {
            if (!text) {
              return;
            }
            stopGenerate();
            await new Promise((resolve) => setTimeout(resolve, 100)); // 等待下一个事件循环
            sendTextChatMessages(text);
          }}
        />
        <Button
          disabled={!text.length && !answering}
          theme="solid"
          className={"battle-send-button"}
          onClick={stopGenerate}
        >
          {answering ? "终止输出" : "发送"}
        </Button>
      </div>
      {(messages[models[0]].filter((x) => x.type === "reply").length > 0 ||
        answering) && (
        <div className={"new-round"}>
          <Button theme="solid" onClick={newRound}>
            开始新一轮
          </Button>
        </div>
      )}
    </div>
  );
};
