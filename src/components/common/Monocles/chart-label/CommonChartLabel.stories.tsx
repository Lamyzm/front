import CommonChartLabel from '@Monocles/chart-label/CommonChartLabel';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Monocles/ChartLabel/CommonChartLabel',
  component: CommonChartLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text', description: 'text 내용' },
    size: { control: 'select', options: ['sm', 'md'] },
    boxColor: {
      control: 'select',
      options: ['primary', 'lightBlue', 'claim', 'empty'],
    },
    textType: { control: 'select', options: ['default', 'gray'] },
  },
} satisfies Meta<typeof CommonChartLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: '임대료',
    size: 'md',
    boxColor: 'primary',
    textType: 'default',
  },
};
