import type { Meta, StoryObj } from "@storybook/react";
import { ModelSelector } from "../../singleChat/ModelSelector";

const meta = {
  title: "SingleChat/ModelSelector",
  component: ModelSelector,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "default-bg", // Default background
      values: [{ name: "default-bg", value: "rgb(0,0,0)" }],
    },
  },
} satisfies Meta<typeof ModelSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    defaultModel: "222",
    setModelName: () => {
      console.log("a");
    },
  },
};

// export const NotEmptyWithDefaultValue: Story = {
//   args: {
//     currentModels: [
//       {
//         model_name: "GPT-4o",
//         model_id: "1",
//       },
//       {
//         model_name: "GPT-5o",
//         model_id: "2",
//       },
//       {
//         model_name: "GPT-6o",
//         model_id: "3",
//       },
//       {
//         model_name: "GPT-7o",
//         model_id: "4",
//       },
//     ],
//     defaultModel: {
//       model_id: "4",
//       model_name: "GPT7o",
//     },
//   },
// };
