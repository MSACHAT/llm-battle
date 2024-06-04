import type { Meta, StoryObj } from "@storybook/react";
import { LoginButton } from "../../login/LoginButton/LoginButton";

const meta = {
  title: "Login/LoginButton",
  component: LoginButton,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
};
