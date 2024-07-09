import Text from "@douyinfe/semi-ui/lib/es/typography/text";
import { useNavigate } from "react-router-dom";
import Title from "@douyinfe/semi-ui/lib/es/typography/title";
import { ModelModel } from "@/interface";
import { Button } from "@douyinfe/semi-ui";
import { IconStop } from "@douyinfe/semi-icons";
export const ModelText = ({
  model,
  isTitle,
}: {
  model: ModelModel;
  isTitle?: boolean;
}) => {
  const navi = useNavigate();
  return isTitle ? (
    <Title
      heading={6}
      link
      onClick={() => {
        window.open(`/singleChat/?chat_id=new&model_name=${model.model_name}`);
      }}
    >
      {model.model_name}
    </Title>
  ) : (
    <Text
      link
      onClick={() => {
        navi(`/singleChat/?chat_id=new&model_name=${model.model_name}`);
      }}
    >
      {model.model_name}
    </Text>
  );
};

export const StopAnswerButton = ({ onClick }: { onClick: any }) => (
  <Button
    className={"stop-answer-button"}
    icon={<IconStop />}
    theme="borderless"
    size="small"
    onClick={onClick}
  >
    停止回答
  </Button>
);
