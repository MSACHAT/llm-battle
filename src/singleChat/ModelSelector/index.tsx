import { Select } from "@douyinfe/semi-ui";
import apiClient from "@/middlewares/axiosInterceptors";
import { useEffect, useRef, useState } from "react";

export type model = {
  model_id: string;
  model_name: string;
};

type options = {
  value: string;
  label: string;
  model_id: string;
};

export const ModelSelector = ({ defaultModel = "none" }) => {
  const [val, setVal] = useState<string>("");
  const currentModels = useRef<model[]>([]);
  const [options, setOptions] = useState<options[]>([]);

  const HandleOnChange = (
    value: string | number | any[] | Record<string, any> | undefined,
  ) => {
    if (typeof value === "string") {
      localStorage.setItem("current_model_name", value);
      setVal(value);
    }
  };

  useEffect(() => {
    apiClient.get("http://172.10.21.42:8087/api/models").then((res) => {
      if (Array.isArray(res)) {
        currentModels.current = res.map((model) => {
          return {
            model_id: model.id,
            model_name: model.modelName,
          };
        });
        setOptions(
          res.map((model) => {
            return {
              value: model.modelName,
              label: model.modelName,
              model_id: model.id,
            };
          }),
        );
      } else {
        console.error("Expected an array but got", res);
      }
    });
  }, []);

  return (
    <Select
      value={val}
      onChange={HandleOnChange}
      defaultValue={defaultModel}
      prefix={"当前模型:"}
      style={{ width: 180 }}
      optionList={options}
    />
  );
};
