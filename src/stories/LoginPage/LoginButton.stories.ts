import type { Meta, StoryObj } from "@storybook/react";
import { LoginButton } from "../../login/LoginButton/LoginButton";
import { any } from "prop-types";

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
  args: {
    disabled: true,
    password: "test",
    account: "test",
    onLogin(status) {
      console.log("test");
    },
    children: "登录",
  },
};
