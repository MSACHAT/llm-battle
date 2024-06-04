import type { Meta, StoryObj } from "@storybook/react";

import { ChatBlock } from "../../chat/LeftNavBar/LeftNavBar";

const meta = {
  title: "SingleChat/ChatBlock",
  component: ChatBlock,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "default-bg", // Default background
      values: [{ name: "default-bg", value: "rgb(28, 30, 41)" }],
    },
  },
} satisfies Meta<typeof ChatBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchosen: Story = {
  args: {
    chatModel: "Gemini 1.5",
    chatTitle: "Welcome",
    chosen: false,
  },
};

export const Chosen: Story = {
  args: {
    chatModel: "Gemini 1.5",
    chatTitle: "Welcome",
    chosen: true,
  },
};
