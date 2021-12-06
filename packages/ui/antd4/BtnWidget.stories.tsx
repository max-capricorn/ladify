
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';


import  BtnWidget  from './BtnWidget';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/BtnWidget',
  component: BtnWidget,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof BtnWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BtnWidget> = (args) => <BtnWidget {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  primary: true,
  label: 'BtnWidget',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'BtnWidget',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'BtnWidget',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};
