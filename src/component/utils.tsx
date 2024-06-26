import Text from "@douyinfe/semi-ui/lib/es/typography/text";
import { useNavigate } from "react-router-dom";
import Title from "@douyinfe/semi-ui/lib/es/typography/title";
import { ModelModel } from "@/interface";

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
        window.open("/singleChat/1"); //TODO change
      }}
    >
      {model.model_name}
    </Title>
  ) : (
    <Text
      link
      onClick={() => {
        navi("/singleChat/1"); //TODO change
      }}
    >
      {model.model_name}
    </Text>
  );
};
