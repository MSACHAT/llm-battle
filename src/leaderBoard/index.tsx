import { Select, Table, Typography } from "@douyinfe/semi-ui";
import { ReactNode, useState } from "react";
import styles from "./index.module.scss";
import { IconChevronDown } from "@douyinfe/semi-icons";
import { TriggerRenderProps } from "@douyinfe/semi-ui/lib/es/select";
import Text from "@douyinfe/semi-ui/lib/es/typography/text";
import { ModelText } from "@/component/utils";

interface DataItem {
  ratingSystem?: string;
  category?: string;
  lastUpdated?: string;
  arena_table?: ArenaTableEntry[];
  dataSource?: string;
}

interface ArenaTableEntry {
  "Rank* (UB)": string;
  Model: string;
  Elo: number;
  "95% CI": string;
  Votes: number;
  Organization: string;
  License: string;
  "Knowledge Cutoff Date": string;
}

interface Option {
  value: number;
  label: string;
  otherKey: number;
}

const data: DataItem[] = [
  {
    ratingSystem: "elo",
    category: "full",
    lastUpdated: "2024-05-27 21:55:57 PDT",
    arena_table: [
      {
        "Rank* (UB)": "1",
        Model: "GPT-4o",
        Elo: 1013,
        "95% CI": "+30/-30",
        Votes: 209,
        Organization: "OpenAI",
        License: "Proprietary",
        "Knowledge Cutoff Date": "2023-10",
      },
      {
        "Rank* (UB)": "2",
        Model: "Gemini-1.5 pro",
        Elo: 1009,
        "95% CI": "+42/-39",
        Votes: 172,
        Organization: "Google",
        License: "Proprietary",
        "Knowledge Cutoff Date": "2023-11",
      },
      {
        "Rank* (UB)": "3",
        Model: "GPT-4",
        Elo: 1009,
        "95% CI": "+41/-37",
        Votes: 189,
        Organization: "OpenAI",
        License: "Proprietary",
        "Knowledge Cutoff Date": "2023-04",
      },
      {
        "Rank* (UB)": "4",
        Model: "Gemini-1.5 flash",
        Elo: 1007,
        "95% CI": "+35/-27",
        Votes: 216,
        Organization: "Google",
        License: "Proprietary",
        "Knowledge Cutoff Date": "2023-11",
      },
    ],
  },
  {
    dataSource: "bt",
    category: "chinese",
    lastUpdated: "2024-05-27 09:25:49 PDT",
    arena_table: [
      {
        "Rank* (UB)": "1",
        Model: "Gemini-1.5 flash",
        Elo: 1053,
        "95% CI": "+74/-53",
        Votes: 45,
        Organization: "Google",
        License: "Proprietary",
        "Knowledge Cutoff Date": "2023-11",
      },
      {
        "Rank* (UB)": "2",
        Model: "Gemini-1.5 pro",
        Elo: 1044,
        "95% CI": "+95/-83",
        Votes: 41,
        Organization: "Google",
        License: "Proprietary",
        "Knowledge Cutoff Date": "2023-11",
      },
      {
        "Rank* (UB)": "3",
        Model: "GPT-4o",
        Elo: 1014,
        "95% CI": "+70/-74",
        Votes: 40,
        Organization: "OpenAI",
        License: "Proprietary",
        "Knowledge Cutoff Date": "2023-10",
      },
      {
        "Rank* (UB)": "4",
        Model: "GPT-4",
        Elo: 1008,
        "95% CI": "+75/-71",
        Votes: 48,
        Organization: "Proprietary",
        License: "Proprietary",
        "Knowledge Cutoff Date": "2023-04",
      },
    ],
  },
  {
    dataSource: "bt",
    category: "english",
    lastUpdated: "2024-05-27 21:55:57 PDT",
    arena_table: [
      {
        "Rank* (UB)": "1",
        Model: "Gemini-1.5 flash",
        Elo: 1053,
        "95% CI": "+42/-36",
        Votes: 45,
        Organization: "Google",
        License: "Proprietary",
        "Knowledge Cutoff Date": "2023-11",
      },
      {
        "Rank* (UB)": "2",
        Model: "Gemini-1.5 pro",
        Elo: 1019,
        "95% CI": "+48/-38",
        Votes: 41,
        Organization: "Google",
        License: "Proprietary",
        "Knowledge Cutoff Date": "2023-11",
      },
      {
        "Rank* (UB)": "3",
        Model: "GPT-4o",
        Elo: 1012,
        "95% CI": "+40/-39",
        Votes: 40,
        Organization: "OpenAI",
        License: "Proprietary",
        "Knowledge Cutoff Date": "2023-10",
      },
      {
        "Rank* (UB)": "4",
        Model: "GPT-4",
        Elo: 1011,
        "95% CI": "+44/-24",
        Votes: 48,
        Organization: "Proprietary",
        License: "Proprietary",
        "Knowledge Cutoff Date": "2023-04",
      },
    ],
  },
];

const list: Option[] = data.map((i, index) => ({
  value: index,
  label: i.category!,
  otherKey: index,
}));

const columns = [
  { title: "Rank* (UB)", dataIndex: "Rank* (UB)" },
  {
    title: "Model",
    dataIndex: "Model",
    render: (model_name: string) => (
      <ModelText model={{ model_name, _id: "1" }} />
    ),
  },
  { title: "Elo", dataIndex: "Elo" },
  { title: "95% CI", dataIndex: "95% CI" },
  { title: "Votes", dataIndex: "Votes" },
  { title: "Organization", dataIndex: "Organization" },
  { title: "License", dataIndex: "License" },
  { title: "Knowledge Cutoff Date", dataIndex: "Knowledge Cutoff Date" },
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
  // useEffect(() => {
  //   apiClient.get(``); //暂留明天改
  // }, []);
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
            optionList={list}
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
    </div>
  );
};
