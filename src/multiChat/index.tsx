import "./index.scss";
import { VoteButtons } from "./VoteButtons/index";
import { Button, Input } from "@douyinfe/semi-ui";

export const MultiChat = () => {
  return (
    <div className={"multi-chat"}>
      <VoteButtons />
      <div className={"user-input"}>
        <Input className={"input-area"}></Input>
        <Button className={"send-button"}>发送</Button>
      </div>
    </div>
  );
};
