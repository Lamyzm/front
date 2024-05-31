import { Button } from '@/components/ui/button';
import { Calendar, CalendarProps } from '@/components/ui/calendar';
import { PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { PopoverClose, PopoverContentProps } from '@radix-ui/react-popover';
import React, { useState } from 'react';
import { ko } from 'date-fns/locale';
import { formatDateToMM_DD } from '@/utils';
import { addMonths } from 'date-fns';
import { ActiveModifiers } from 'react-day-picker';

enum ActivePreset {
  NONE = 'none',
  ONE_MONTH = 'one month',
  THREE_MONTH = 'three month',
  SIX_MONTH = 'six month',
  TWELVE_MONTH = 'twelve month',
  TWENTY_FOUR_MONTH = 'twenty four month',
}

const presetListStyle =
  'cursor-pointer px-4 py-3 transition hover:bg-icon-bg active:bg-blue-200 active:text-text-primary text-text-primary relative';
const activeMarkStyle = 'absolute left-0 top-0 h-full w-[6px] rounded-br-[8px] rounded-tr-[8px] bg-primary';

export default function DatePicker({
  popoverContentProps,
  className,
  hiddenPreset,
  ...props
}: CalendarProps & {
  popoverContentProps?: PopoverContentProps;
  hiddenPreset?: boolean;
}) {
  const [activePreset, setActivePreset] = useState<ActivePreset>(ActivePreset.ONE_MONTH);
  const onClick1Month = () => {
    if (props.mode === 'range' && props.onSelect) {
      const newDate = new Date();
      props.onSelect(
        {
          from: addMonths(newDate, -1),
          to: newDate,
        },
        newDate,
        // 아래의 두 인자는 react-day-picker 내부에서 동작할 때 필요한 값, 해당 로직에서는 사용될 일이 없어서 타입 예외 처리해주었음.
        undefined as unknown as ActiveModifiers,
        undefined as unknown as React.MouseEvent,
      );
      setActivePreset(ActivePreset.ONE_MONTH);
    }
  };
  const onClick3Month = () => {
    if (props.mode === 'range' && props.onSelect) {
      const newDate = new Date();
      props.onSelect(
        {
          from: addMonths(newDate, -3),
          to: newDate,
        },
        newDate,
        // 아래의 두 인자는 react-day-picker 내부에서 동작할 때 필요한 값, 해당 로직에서는 사용될 일이 없어서 타입 예외 처리해주었음.
        undefined as unknown as ActiveModifiers,
        undefined as unknown as React.MouseEvent,
      );
      setActivePreset(ActivePreset.THREE_MONTH);
    }
  };
  const onClick6Month = () => {
    if (props.mode === 'range' && props.onSelect) {
      const newDate = new Date();
      props.onSelect(
        {
          from: addMonths(newDate, -6),
          to: newDate,
        },
        newDate,
        // 아래의 두 인자는 react-day-picker 내부에서 동작할 때 필요한 값, 해당 로직에서는 사용될 일이 없어서 타입 예외 처리해주었음.
        undefined as unknown as ActiveModifiers,
        undefined as unknown as React.MouseEvent,
      );
      setActivePreset(ActivePreset.SIX_MONTH);
    }
  };
  const onClick12Month = () => {
    if (props.mode === 'range' && props.onSelect) {
      const newDate = new Date();
      props.onSelect(
        {
          from: addMonths(newDate, -12),
          to: newDate,
        },
        newDate,
        // 아래의 두 인자는 react-day-picker 내부에서 동작할 때 필요한 값, 해당 로직에서는 사용될 일이 없어서 타입 예외 처리해주었음.
        undefined as unknown as ActiveModifiers,
        undefined as unknown as React.MouseEvent,
      );
      setActivePreset(ActivePreset.TWELVE_MONTH);
    }
  };
  const onClick24Month = () => {
    if (props.mode === 'range' && props.onSelect) {
      const newDate = new Date();
      props.onSelect(
        {
          from: addMonths(newDate, -24),
          to: newDate,
        },
        newDate,
        // 아래의 두 인자는 react-day-picker 내부에서 동작할 때 필요한 값, 해당 로직에서는 사용될 일이 없어서 타입 예외 처리해주었음.
        undefined as unknown as ActiveModifiers,
        undefined as unknown as React.MouseEvent,
      );
      setActivePreset(ActivePreset.TWENTY_FOUR_MONTH);
    }
  };

  return (
    <PopoverContent
      className="flex w-min px-0 py-0"
      align="start"
      {...popoverContentProps}>
      {!hiddenPreset && (
        <aside className="w-[133px] border-r border-stroke py-3">
          <ul>
            <li
              onClick={onClick1Month}
              className={cn(presetListStyle, {
                'bg-icon-bg': activePreset === ActivePreset.ONE_MONTH,
              })}>
              {activePreset === ActivePreset.ONE_MONTH && <div className={activeMarkStyle} />}
              1개월
            </li>
            <li
              onClick={onClick3Month}
              className={cn(presetListStyle, { 'bg-icon-bg': activePreset === ActivePreset.THREE_MONTH })}>
              {activePreset === ActivePreset.THREE_MONTH && <div className={activeMarkStyle} />}
              3개월
            </li>
            <li
              onClick={onClick6Month}
              className={cn(presetListStyle, { 'bg-icon-bg': activePreset === ActivePreset.SIX_MONTH })}>
              {activePreset === ActivePreset.SIX_MONTH && <div className={activeMarkStyle} />}
              6개월
            </li>
            <li
              onClick={onClick12Month}
              className={cn(presetListStyle, { 'bg-icon-bg': activePreset === ActivePreset.TWELVE_MONTH })}>
              {activePreset === ActivePreset.TWELVE_MONTH && <div className={activeMarkStyle} />}
              12개월
            </li>
            <li
              onClick={onClick24Month}
              className={cn(presetListStyle, { 'bg-icon-bg': activePreset === ActivePreset.TWENTY_FOUR_MONTH })}>
              {activePreset === ActivePreset.TWENTY_FOUR_MONTH && <div className={activeMarkStyle} />}
              24개월
            </li>
          </ul>
        </aside>
      )}
      <div className="w-[322px]">
        <Calendar
          fixedWeeks
          locale={ko}
          className={cn('border-b border-stroke', className)}
          onDayClick={() => setActivePreset(ActivePreset.NONE)}
          {...props}
        />
        <footer className="flex h-[71px] justify-end gap-8 px-4 py-4">
          {props.mode === 'range' && props.selected && (
            <div className="flex w-[128px] items-center justify-center rounded-[6px] border text-body4 text-text-primary">
              {formatDateToMM_DD(props.selected.from)} ~ {formatDateToMM_DD(props.selected.to)}
            </div>
          )}
          <PopoverClose>
            <Button
              className="w-[128px] rounded-[6px]"
              size="sm"
              variant="primary">
              설정 완료
            </Button>
          </PopoverClose>
        </footer>
      </div>
    </PopoverContent>
  );
}
