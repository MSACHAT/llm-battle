import { FC, useCallback, useContext, useEffect } from "react";
import { throttle } from "lodash-es";
import type { MessageType } from "midjourney-fetch";
import { Tag, message as GlobalMessage } from "antd";
import GlobalContext from "@contexts/global";
import { ConversationMode, Message } from "@interfaces";
import markdown from "@utils/markdown";
import { getRelativeTime } from "@utils/date";
import SystemAvatar from "@components/Avatar/system";
import "./index.css";
import { copyToClipboard } from "@utils";

const { CheckableTag } = Tag;
const MessageItem: FC<{
  message: Message;
  onOperationClick?: (
    type: MessageType,
    customId: string,
    messageId: string,
    prompt: string,
  ) => void;
  mode?: ConversationMode;
  index?: number;
}> = ({ message, onOperationClick, mode, index }) => {
  const createdAt = getRelativeTime(message.createdAt, true);

  return (
    <div>
      <div>
        <div />
        <div>
          {createdAt ? <div>{createdAt}</div> : <div />}
          <div>
            <CheckableTag checked={false}>copy</CheckableTag>
          </div>
        </div>
      </div>
    </div>
  );
};
