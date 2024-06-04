import type { Meta, StoryObj } from "@storybook/react";
import { LeftNavBar } from "../../chat/LeftNavBar/LeftNavBar";

const meta = {
  title: "SingleChat/LeftNavigatorBar",
  component: LeftNavBar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LeftNavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    chats: [],
  },
};

export const OneChatBlock: Story = {
  args: {
    chats: [
      {
        chatModel: "gpt-4",
        chatTitle: "welcome",
        chosen: true,
      },
    ],
  },
};

export const ManyChatBlocks: Story = {
  args: {
    chats: [
      {
        chatModel: "gpt-1",
        chatTitle: "welcome",
        chosen: false,
      },
      {
        chatModel: "gpt-2",
        chatTitle: "welcome",
        chosen: true,
      },
      {
        chatModel: "gpt-3",
        chatTitle: "welcome",
        chosen: false,
      },
      {
        chatModel: "gpt-4",
        chatTitle: "welcome",
        chosen: false,
      },
      {
        chatModel: "gpt-4",
        chatTitle: "welcome",
        chosen: false,
      },
      {
        chatModel: "gpt-4",
        chatTitle: "welcome",
        chosen: false,
      },
      {
        chatModel: "gpt-4",
        chatTitle: "welcome",
        chosen: false,
      },
    ],
  },
};
