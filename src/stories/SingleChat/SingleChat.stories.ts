import type { Meta, StoryObj } from "@storybook/react";
import { Chat } from "../../chat/index";

const meta: Meta<typeof Chat> = {
  title: "SingleChat",
  component: Chat,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "default-bg",
      values: [{ name: "default-bg", value: "rgb(28, 30, 41)" }],
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
Default.parameters = {
  mockData: [
    {
      url: "https://mock/1",
      method: "GET",
      status: 200,
      response: [
        {
          content: "滚动加载1",
          type: "query",
          id: -1,
        },
        {
          content: "滚动加载2",
          type: "reply",
          id: -2,
        },
        {
          content: "滚动加载1",
          type: "query",
          id: -3,
        },
        {
          content: "滚动加载2",
          type: "reply",
          id: -4,
        },
        {
          content: "滚动加载1",
          type: "query",
          id: -5,
        },
        {
          content: "滚动加载2",
          type: "reply",
          id: -6,
        },
        {
          content: "滚动加载1",
          type: "query",
          id: -7,
        },
        {
          content: "滚动加载2",
          type: "reply",
          id: -8,
        },
        {
          content: "滚动加载1",
          type: "query",
          id: -9,
        },
        {
          content: "滚动加载2",
          type: "reply",
          id: -10,
        },
        {
          content: "滚动加载1",
          type: "query",
          id: -11,
        },
        {
          content: "滚动加载2",
          type: "reply",
          id: -12,
        },
      ],
    },
  ],
};
