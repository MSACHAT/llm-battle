import { Spin } from "@douyinfe/semi-ui";
import "./BotReplyBubble.scss";
import { marked } from "marked";
import hljs from "highlight.js";
import React from "react";

const BlinkingCursor: React.FC = () => {
  return <div className="cursor"></div>;
};

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
  return (
    <div className={"bot-reply"}>
      <div className={"bot-chat-bubble"}>
        {loading && !content ? (
          <Spin size={"middle"} style={{ marginBottom: -8 }} />
        ) : (
          <>
            {renderMessageContent(content) || "未知错误"}
            {loading ? <BlinkingCursor /> : ""}
          </>
        )}
      </div>
    </div>
  );
};
