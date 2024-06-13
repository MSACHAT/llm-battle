import { Button, Notification } from "@douyinfe/semi-ui";
import React, { ReactNode, useEffect, useState } from "react";
import "../index.scss";
import Text from "@douyinfe/semi-ui/lib/es/typography/text";
import apiClient from "@/middlewares/axiosInterceptors";
import axios, { AxiosResponse } from "axios";
import { ModelModel } from "@/interface";
const VoteComponent = ({
  battle_id,
  onVoteFinish,
}: {
  battle_id: string;
  onVoteFinish: (models: ModelModel[]) => void;
}) => {
  const [ip, setIp] = useState<string>("");

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const res: AxiosResponse<{ ip: string }> = await axios.get(
          "https://api.ipify.org?format=json",
        );
        setIp(res.data.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };

    fetchIp();
  }, []);
  const [flag, setFlag] = useState(false);
  const VoteButton = ({
    type,
    children,
  }: {
    type: string;
    children: ReactNode;
  }) => (
    <Button
      theme={"solid"}
      disabled={flag}
      onClick={() => {
        apiClient
          .post<{ models: ModelModel[] }>("api/v1/vote/sidebyside_anonymous", {
            type: type,
            battle_id,
            ip,
          })
          .then((res) => {
            onVoteFinish(res.models);
            Notification.info({
              title: (
                <Text strong style={{ fontSize: 18 }}>
                  感谢您的投票
                </Text>
              ),
              content: "您的投票将被记入排行榜",
              duration: 3,
            });
            setFlag(true);
          });
      }}
    >
      {children}
    </Button>
  );
  return (
    <div className="button-container">
      <VoteButton type={"leftvote"}>👈左边好些</VoteButton>
      <VoteButton type={"rightvote"}>👉右边好些</VoteButton>
      <VoteButton type={"tievote"}>平局</VoteButton>
      <VoteButton type={"bothbad_vote"}>都不好</VoteButton>
    </div>
  );
};
export default VoteComponent;
