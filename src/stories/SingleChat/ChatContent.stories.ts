import type { Meta, StoryObj } from "@storybook/react";
import Content from "../../chat/index3";

const meta = {
  title: "SingleChat/Chat2",
  component: Content,
  parameters: {
    layout: "fullscreen",
    // backgrounds: {
    //   default: "default-bg", // Default background
    //   values: [{ name: "default-bg", value: "rgb(28, 30, 41)" }],
    // },
  },
} satisfies Meta<typeof Content>;

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
