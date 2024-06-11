import type { Meta, StoryObj } from "@storybook/react";
import { MultiChat } from "../../multiChat/index";

const meta = {
  title: "MultiChat",
  component: MultiChat,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MultiChat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
