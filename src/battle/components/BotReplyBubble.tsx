import { Spin } from "@douyinfe/semi-ui";
import "./BotReplyBubble.scss";
import { marked } from "marked";
import hljs from "highlight.js";
import React, { useState } from "react";
import { Simulate } from "react-dom/test-utils";
import load = Simulate.load;
import { set } from "lodash-es";

function renderMessageContent(msg: any) {
  marked.setOptions({
    renderer: new marked.Renderer(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    highlight: function (code, _lang) {
      return hljs.highlightAuto(code).value;
    },
    langPrefix: "hljs language-",
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartypants: false,
    xhtml: false,
  });
  const html = marked(msg);
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    <div className="show-html" dangerouslySetInnerHTML={{ __html: html }}></div>
  );
}

export const BotReply = ({
  content,
  loading = false,
}: {
  content: string;
  loading?: boolean;
}) => {
  const [blink, setBlink] = useState(false);
  setInterval(() => {
    if (loading) {
      setBlink(!blink);
    }
  }, 500);
  return (
    <div className={"bot-reply"}>
      <div className={"bot-chat-bubble"}>
        {loading && !content ? (
          <Spin size={"middle"} style={{ marginBottom: -8 }} />
        ) : (
          <>
            {renderMessageContent(
              content + (loading && blink ? "▌" : "") || "未知错误",
            )}
          </>
        )}
      </div>
    </div>
  );
};
