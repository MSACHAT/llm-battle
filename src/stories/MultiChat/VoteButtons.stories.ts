import type { Meta, StoryObj } from "@storybook/react";

import { VoteButtons } from "../../multiChat/VoteButtons/index";

const meta = {
  title: "MultiChat/VoteButtons",
  component: VoteButtons,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "default-bg", // Default background
      values: [{ name: "default-bg", value: "rgb(28, 30, 41)" }],
    },
  },
} satisfies Meta<typeof VoteButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
