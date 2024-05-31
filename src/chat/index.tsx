import { Button, Input } from "@douyinfe/semi-ui";
import { useState } from "react";
import { TypeAnimation } from "react-type-animation";

export const Chat = () => {
  const [userInput, setUserInput] = useState(" ");
  const [respond, setRespond] = useState("");
  const [key, setKey] = useState(0);
  const query = async (msg: string) => {
    try {
      const res = await fetch("https://api.coze.com/open_api/v2/chat", {
        headers: {
          Authorization:
            "Bearer pat_9qv4hQgwIGqJLxeqX7b0D0v7L8St7qHa4U0pvDxMblA4LzIO7ORkq135sSB2DGUt",
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
          query: msg,
          stream: true,
        }),
      });
      if (!res.ok) {
        return new Response(res.body, {
          status: res.status,
        });
      }

      const decoder = new TextDecoder();

      const stream = new ReadableStream({
        async start() {
          for await (const chunk of res.body as any) {
            const str = decoder.decode(chunk).slice(5);
            let obj = JSON.parse(str);
            if (!obj.is_finish) {
              console.log(obj);
              obj = obj.message;
              obj = obj.content;
              console.log(obj);
              setRespond((prevState) => prevState + obj);
              setKey((prevState) => prevState + 1);
            }
          }
        },
      });

      return new Response(stream);
    } catch (e: any) {
      console.log("Error", e);
      return new Response(
        JSON.stringify({ msg: e?.message || e?.stack || e }),
        {
          status: 500,
        },
      );
    }
  };
  return (
    <div>
      <Input value={userInput} onChange={setUserInput}></Input>
      <Button
        onClick={() => {
          setRespond("");
          setKey((prevState) => prevState + 1);
          query(userInput);
        }}
      >
        发送
      </Button>
      <TypeAnimation
        key={key}
        className={"type-ani"}
        splitter={(str) => str.split(/(?= )/)} // 'Lorem ipsum dolor' -> ['Lorem', ' ipsum', ' dolor']
        sequence={[
          (el) => {
            if (el !== null) {
              el.classList.add("type_ani");
            }
          },
          respond,
          (el: HTMLElement | null) => {
            if (el !== null) {
              el.classList.remove("type_ani");
            }
          },
        ]}
        speed={{ type: "keyStrokeDelayInMs", value: 30 }}
        omitDeletionAnimation={true}
        preRenderFirstString={true}
        style={{ fontSize: "1em", display: "block", minHeight: "200px" }}
        cursor={false}
      />
      <style>{`
        .type_ani::after {
          content: "▌";
          animation: cursor 1.1s infinite step-start;
        }

        @keyframes cursor {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
