import { Select, Spin, Table, Typography } from "@douyinfe/semi-ui";
import { ReactNode, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { IconChevronDown } from "@douyinfe/semi-icons";
import { TriggerRenderProps } from "@douyinfe/semi-ui/lib/es/select";
import Text from "@douyinfe/semi-ui/lib/es/typography/text";
import { ModelText } from "@/component/utils";
import axios from "axios";
import config from "@/config/config";

interface DataItem {
  category: string;
  lastUpdated?: string;
  arena_table?: ArenaTableEntry[];
  dataSource?: string;
}

interface ArenaTableEntry {
  rank: string;
  model: string;
  elo: number;
  ci: string;
  votes: number;
  organization: string;
  license: string;
  knowledgeCutoff: string;
}

interface Option {
  value: number;
  label: string;
  otherKey: number;
}

const columns = [
  { title: "Rank* (UB)", dataIndex: "rank" },
  {
    title: "Model",
    dataIndex: "model",
    render: (model_name: string) => (
      <ModelText model={{ model_name, _id: "1" }} />
    ),
  },
  { title: "Elo", dataIndex: "elo" },
  { title: "95% CI", dataIndex: "ci" },
  { title: "Votes", dataIndex: "votes" },
  { title: "Organization", dataIndex: "organization" },
  { title: "License", dataIndex: "license" },
  { title: "Knowledge Cutoff Date", dataIndex: "knowledgeCutoff" },
];

const triggerRender = (props: TriggerRenderProps): ReactNode => {
  return (
    <div
      style={{
        minWidth: "112px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        display: "flex",
        alignItems: "center",
        paddingLeft: 12,
        borderRadius: 3,
        color: "white",
        height: "54px",
      }}
    >
      <div
        style={{
          margin: 4,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{props.value.map((item) => item.label).join(" , ")}</span>
        <IconChevronDown style={{ marginRight: 8, flexShrink: 0 }} />
      </div>
    </div>
  );
};

export const LeaderBoard: React.FC = () => {
  const [listOptions, setListOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<DataItem[]>([]);
  const [category, setCategory] = useState<number>(0);
  const [val, setVal] = useState<number>(0);
  const { Title, Text } = Typography;
  const body = document.body;
  body.setAttribute("theme-mode", "dark");
  const handleRow = (record: any, index: number | undefined) => {
    return {
      style:
        index !== undefined && index % 2 === 0
          ? { background: "rgba(255, 255, 255, 0.05)" }
          : {},
    };
  };
  useEffect(() => {
    setIsLoading(true);

    async function fetchData() {
      try {
        const response = await axios.get(config.apiUrl + "/api/v1/arena_table");
        setData(response.data);
        const options = response.data.map(
          (i: { category: any }, index: any) => ({
            value: index,
            label: i.category ?? "N/A",
            otherKey: index,
          }),
        );
        setListOptions(options);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={styles.leaderBoard}>
      <Title
        heading={2}
        className={styles.title}
        style={{ marginBottom: "40px" }}
      >
        排行榜规则
      </Title>
      <Text className={styles.text} style={{ marginBottom: "56px" }}>
        AI模型大PK是一个用于 LLM 评估的众包开放平台。我们收集了超过1,000,000
        次人类成对比较，使用Bradley-Terry 模型进行排名，并以 Elo
        量表显示模型评级。您可以在我们的论文中找到更多详细信息。
      </Text>
      <Title
        heading={2}
        className={styles.title}
        style={{ marginBottom: "24px" }}
      >
        排行榜
      </Title>
      {isLoading ? (
        <Spin size={"large"} />
      ) : (
        <>
          <div className={styles.option}>
            <div className={styles.Classification}>
              <Title heading={6} className={styles.title}>
                分类
              </Title>
              <Select
                value={val}
                triggerRender={triggerRender}
                className={styles.select}
                style={{
                  marginTop: 20,
                  outline: 0,
                }}
                optionList={listOptions}
                onChange={(value) => {
                  setCategory(value as number);
                  setVal(value as number);
                }}
              ></Select>
            </div>
            <Title heading={6} className={styles.title}>
              信息
            </Title>
          </div>
          <div className={styles.scrollableContainer}>
            <Table
              columns={columns}
              dataSource={data[category].arena_table}
              pagination={false}
              onRow={handleRow}
            />
          </div>
        </>
      )}
    </div>
  );
};
