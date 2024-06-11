import { Button } from "@douyinfe/semi-ui";
import "./index.scss";

export const VoteButtons = () => {
  return (
    <div className={"vote-buttons"}>
      <div className={"sector-1"}>
        <Button>A更好</Button>
        <Button>B更好</Button>
      </div>
      <div className={"sector-2"}>
        <Button>平局</Button>
        <Button>俩个都不好</Button>
      </div>
    </div>
  );
};
