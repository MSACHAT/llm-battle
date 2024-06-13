import Text from "@douyinfe/semi-ui/lib/es/typography/text";
import { useNavigate } from "react-router-dom";
import Title from "@douyinfe/semi-ui/lib/es/typography/title";

export const ModelText = ({
  detail,
  isTitle,
}: {
  detail: any;
  isTitle?: boolean;
}) => {
  const navi = useNavigate();
  return isTitle ? (
    <Title
      heading={6}
      link
      onClick={() => {
        window.open("/singleChat");
      }}
    >
      {detail.text}
    </Title>
  ) : (
    <Text
      link
      onClick={() => {
        navi("/singleChat");
      }}
    >
      {detail.text}
    </Text>
  );
};
