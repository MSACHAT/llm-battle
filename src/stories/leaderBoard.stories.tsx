import type { Meta, StoryObj } from "@storybook/react";

import { LeaderBoard } from "../../leaderBoard";

const meta = {
  title: "LeaderBoard/LeaderBoard",
  component: LeaderBoard,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
