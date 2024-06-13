import Text from "@douyinfe/semi-ui/lib/es/typography/text";
import { useNavigate } from "react-router-dom";

export const ModelText = ({ detail }: { detail: any }) => {
  const navi = useNavigate();
  return (
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
