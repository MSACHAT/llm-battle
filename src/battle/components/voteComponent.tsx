import { Button } from "@douyinfe/semi-ui";
import React from "react";

const voteComponent: React.FC = () => {
  return (
    <div style={{ justifyContent: "center" }}>
      <Button
        style={{
          width: "23.9375rem",
          margin: " 0.375rem  1.5rem 0.375rem  1.5rem",
          backgroundColor: "#F5C950",
          color: "black",
        }}
      >
        👈左边好些
      </Button>
      <Button
        style={{
          width: "23.9375rem",
          margin: " 0.375rem  1.5rem 0.375rem  1.5rem",
          backgroundColor: "#F5C950",
          color: "black",
        }}
      >
        👉右边好些
      </Button>
      <Button
        style={{
          width: "23.9375rem",
          margin: " 0.375rem  1.5rem 0.375rem  1.5rem",
          backgroundColor: "#F5C950",
          color: "black",
        }}
      >
        平局
      </Button>
      <Button
        style={{
          width: "23.9375rem",
          margin: " 0.375rem  1.5rem 0.375rem  1.5rem",
          backgroundColor: "#F5C950",
          color: "black",
        }}
      >
        都不好
      </Button>
    </div>
  );
};

export default voteComponent;
