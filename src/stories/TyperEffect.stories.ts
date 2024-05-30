import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { TyperEffect } from "./TyperEffect";

const meta = {
  title: "Components/Typer",
  component: TyperEffect,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TyperEffect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    words: [],
  },
};

export const CustomWords: Story = {
  args: {
    words: ["I ", "Hate ", "Typescript "],
  },
};
