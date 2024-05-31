import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import voteComponent from "@/component/voteComponent";
import VoteComponent from "@/component/voteComponent";

export default {
  title: "VoteComponent",
  component: voteComponent,
} as Meta<typeof voteComponent>;

const Template: StoryFn<typeof VoteComponent> = (args) => (
  <VoteComponent {...args} />
);

export const Default = Template.bind({});
Default.args = {};
