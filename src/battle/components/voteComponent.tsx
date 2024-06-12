import { Button, Notification } from "@douyinfe/semi-ui";
import React, { ReactNode, useState } from "react";
import "../index.scss";
import Text from "@douyinfe/semi-ui/lib/es/typography/text";
const VoteComponent: React.FC = () => {
  const [flag, setFlag] = useState(false);
  const VoteButton = ({ children }: { children: ReactNode }) => (
    <Button
      theme={"solid"}
      disabled={flag}
      onClick={() => {
        Notification.info({
          title: (
            <Text strong style={{ fontSize: 18 }}>
              感谢您的投票
            </Text>
          ),
          content: "您的投票将被记入排行榜",
          duration: 0,
        });
        setFlag(true);
      }}
    >
      {children}
    </Button>
  );
  return (
    <div className="button-container">
      <VoteButton>👈左边好些</VoteButton>
      <VoteButton>👉右边好些</VoteButton>
      <VoteButton>平局</VoteButton>
      <VoteButton>都不好</VoteButton>
    </div>
  );
};

export default VoteComponent;
