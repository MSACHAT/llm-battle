import { Button } from "@douyinfe/semi-ui";
import React from "react";

const VoteComponent: React.FC = () => {
  return (
    <div className="button-container">
      <Button theme="solid">👈左边好些</Button>
      <Button theme="solid">👉右边好些</Button>
      <Button theme="solid">平局</Button>
      <Button theme="solid">都不好</Button>
    </div>
  );
};

export default VoteComponent;
