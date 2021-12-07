
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';


import {Button} from 'antd';
import  BtnWidget  from './BtnWidget';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/BtnWidget',
  component: BtnWidget,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} as ComponentMeta<typeof BtnWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BtnWidget> = (args) => <BtnWidget {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  type: 'normal',
  content: 'normal btn content',
};

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  content: 'primary btn contnet',
};

export const Danger = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Danger.args = {
  type: 'danger',
  content: 'danger btn content'
};



