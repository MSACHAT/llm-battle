import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import voteComponent from "@/battle/components/voteComponent";
import VoteComponent from "@/battle/components/voteComponent";

export default {
  title: "VoteComponent",
  component: voteComponent,
} as Meta<typeof voteComponent>;

const Template: StoryFn<typeof VoteComponent> = (args) => (
  <VoteComponent {...args} />
);

export const Default = Template.bind({});
Default.args = {};
