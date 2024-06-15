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
        Model: "AssistantModel9",
        Elo: 1021,
        "95% CI": "+33/-34",
        Votes: 194,
        Organization: "Org A",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel3",
        Elo: 1013,
        "95% CI": "+30/-30",
        Votes: 209,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel10",
        Elo: 1009,
        "95% CI": "+42/-39",
        Votes: 172,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel7",
        Elo: 1009,
        "95% CI": "+41/-37",
        Votes: 189,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel8",
        Elo: 1007,
        "95% CI": "+35/-27",
        Votes: 216,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel5",
        Elo: 1004,
        "95% CI": "+35/-37",
        Votes: 195,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel1",
        Elo: 997,
        "95% CI": "+33/-34",
        Votes: 183,
        Organization: "Org B",
        License: "Closed",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel6",
        Elo: 993,
        "95% CI": "+29/-43",
        Votes: 209,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel2",
        Elo: 975,
        "95% CI": "+27/-37",
        Votes: 222,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel4",
        Elo: 971,
        "95% CI": "+29/-32",
        Votes: 211,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
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
        Model: "AssistantModel8",
        Elo: 1053,
        "95% CI": "+74/-53",
        Votes: 45,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel7",
        Elo: 1044,
        "95% CI": "+95/-83",
        Votes: 41,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel3",
        Elo: 1014,
        "95% CI": "+70/-74",
        Votes: 40,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel4",
        Elo: 1008,
        "95% CI": "+75/-71",
        Votes: 48,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel1",
        Elo: 988,
        "95% CI": "+79/-64",
        Votes: 35,
        Organization: "Org B",
        License: "Closed",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel10",
        Elo: 984,
        "95% CI": "+64/-77",
        Votes: 42,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel2",
        Elo: 983,
        "95% CI": "+99/-90",
        Votes: 42,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel5",
        Elo: 983,
        "95% CI": "+79/-60",
        Votes: 50,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel9",
        Elo: 982,
        "95% CI": "+80/-90",
        Votes: 45,
        Organization: "Org A",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel6",
        Elo: 961,
        "95% CI": "+73/-127",
        Votes: 36,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
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
        Model: "AssistantModel9",
        Elo: 1036,
        "95% CI": "+42/-36",
        Votes: 149,
        Organization: "Org A",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel10",
        Elo: 1019,
        "95% CI": "+48/-38",
        Votes: 130,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel3",
        Elo: 1012,
        "95% CI": "+40/-39",
        Votes: 169,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel5",
        Elo: 1011,
        "95% CI": "+44/-24",
        Votes: 145,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel1",
        Elo: 1000,
        "95% CI": "+51/-40",
        Votes: 148,
        Organization: "Org B",
        License: "Closed",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel6",
        Elo: 999,
        "95% CI": "+42/-42",
        Votes: 173,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel7",
        Elo: 997,
        "95% CI": "+40/-39",
        Votes: 148,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel8",
        Elo: 994,
        "95% CI": "+33/-41",
        Votes: 171,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "1",
        Model: "AssistantModel2",
        Elo: 974,
        "95% CI": "+35/-42",
        Votes: 180,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
      },
      {
        "Rank* (UB)": "2",
        Model: "AssistantModel4",
        Elo: 958,
        "95% CI": "+35/-43",
        Votes: 163,
        Organization: "Org C",
        License: "Open",
        "Knowledge Cutoff Date": "2023-01-01",
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
        次人类成对比较，使用Bradley-Terry 模型对法学硕士进行排名，并以 Elo
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
