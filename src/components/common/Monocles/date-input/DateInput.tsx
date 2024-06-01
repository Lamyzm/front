import { Button } from '@/components/ui/button';
import { CalendarProps } from '@/components/ui/calendar';
import { PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { PopoverClose, PopoverContentProps } from '@radix-ui/react-popover';
import React, { useState } from 'react';
import { formatDateToMM_DD, formatDateToYYYYMMDD } from '@/utils';
import { addMonths, isValid, parse } from 'date-fns';
import { ActiveModifiers } from 'react-day-picker';

enum ActivePreset {
  NONE = 'none',
  ONE_MONTH = 'one month',
  THREE_MONTH = 'three month',
  SIX_MONTH = 'six month',
  TWELVE_MONTH = 'twelve month',
  TWENTY_FOUR_MONTH = 'twenty four month',
}

export default function DateInput({
  popoverContentProps,
  className,
  hiddenPreset,
  ...props
}: CalendarProps & {
  popoverContentProps?: PopoverContentProps;
  hiddenPreset?: boolean;
}) {
  const [fromInputValue, setFromInputValue] = useState<string>(
    props.mode === 'range' && props.selected ? formatDateToYYYYMMDD(props.selected?.from) : '',
  );
  const [toInputValue, setToInputValue] = useState<string>(
    props.mode === 'range' && props.selected ? formatDateToYYYYMMDD(props.selected?.to) : '',
  );
  const [activePreset, setActivePreset] = useState<ActivePreset>(ActivePreset.ONE_MONTH);

  const handleClickPreset = (type: ActivePreset) => {
    if (!(props.mode === 'range' && props.onSelect)) return;

    const newDate = new Date();
    let newSelected;
    switch (type) {
      case ActivePreset.ONE_MONTH:
        newSelected = {
          from: addMonths(newDate, -1),
          to: newDate,
        };
        setActivePreset(ActivePreset.ONE_MONTH);
        break;
      case ActivePreset.THREE_MONTH:
        newSelected = {
          from: addMonths(newDate, -3),
          to: newDate,
        };
        setActivePreset(ActivePreset.THREE_MONTH);
        break;
      case ActivePreset.SIX_MONTH:
        newSelected = {
          from: addMonths(newDate, -6),
          to: newDate,
        };
        setActivePreset(ActivePreset.SIX_MONTH);
        break;
      case ActivePreset.TWELVE_MONTH:
        newSelected = {
          from: addMonths(newDate, -12),
          to: newDate,
        };
        setActivePreset(ActivePreset.TWELVE_MONTH);
        break;
      case ActivePreset.TWENTY_FOUR_MONTH:
        newSelected = {
          from: addMonths(newDate, -24),
          to: newDate,
        };
        setActivePreset(ActivePreset.TWENTY_FOUR_MONTH);
        break;
      default:
        newSelected = undefined;
    }

    props.onSelect(
      newSelected,
      newDate,
      // 아래의 두 인자는 react-day-picker 내부에서 동작할 때 필요한 값, 해당 로직에서는 사용될 일이 없어서 타입 예외 처리해주었음.
      undefined as unknown as ActiveModifiers,
      undefined as unknown as React.MouseEvent,
    );
  };

  const handleFromInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!(props.mode === 'range' && props.onSelect)) return;
    setFromInputValue(e.target.value);

    const parsedDate = parse(e.target.value, 'yyyy/MM/dd', new Date());

    if (isValid(parsedDate)) {
      props.onSelect(
        {
          from: parsedDate,
          to: props.selected?.to,
        },
        // 아래의 세 인자는 react-day-picker 내부에서 동작할 때 필요한 값, 해당 로직에서는 사용될 일이 없어서 타입 예외 처리해주었음.
        undefined as unknown as Date,
        undefined as unknown as ActiveModifiers,
        undefined as unknown as React.MouseEvent,
      );
    } else {
      props.onSelect(
        undefined,
        // 아래의 세 인자는 react-day-picker 내부에서 동작할 때 필요한 값, 해당 로직에서는 사용될 일이 없어서 타입 예외 처리해주었음.
        undefined as unknown as Date,
        undefined as unknown as ActiveModifiers,
        undefined as unknown as React.MouseEvent,
      );
    }
  };

  const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!(props.mode === 'range' && props.onSelect)) return;
    setToInputValue(e.target.value); // keep the input value in sync

    const parsedDate = parse(e.target.value, 'yyyy/MM/dd', new Date());

    if (isValid(parsedDate)) {
      props.onSelect(
        {
          from: props.selected?.from,
          to: parsedDate,
        },
        // 아래의 세 인자는 react-day-picker 내부에서 동작할 때 필요한 값, 해당 로직에서는 사용될 일이 없어서 타입 예외 처리해주었음.
        undefined as unknown as Date,
        undefined as unknown as ActiveModifiers,
        undefined as unknown as React.MouseEvent,
      );
    } else {
      props.onSelect(
        undefined,
        // 아래의 세 인자는 react-day-picker 내부에서 동작할 때 필요한 값, 해당 로직에서는 사용될 일이 없어서 타입 예외 처리해주었음.
        undefined as unknown as Date,
        undefined as unknown as ActiveModifiers,
        undefined as unknown as React.MouseEvent,
      );
    }
  };

  return (
    <PopoverContent
      className="flex w-min flex-col px-2 py-2"
      align="start"
      {...popoverContentProps}>
      {!hiddenPreset && (
        <div className="border-b border-stroke">
          <ul className="menu px-0 py-0 text-body1">
            <li
              onClick={() => handleClickPreset(ActivePreset.ONE_MONTH)}
              className={cn({ 'bg-accent': activePreset === ActivePreset.ONE_MONTH })}>
              <a>1개월</a>
            </li>
            <li
              onClick={() => handleClickPreset(ActivePreset.THREE_MONTH)}
              className={cn({ 'bg-accent': activePreset === ActivePreset.THREE_MONTH })}>
              <a>3개월</a>
            </li>
            <li
              onClick={() => handleClickPreset(ActivePreset.SIX_MONTH)}
              className={cn({ 'bg-accent': activePreset === ActivePreset.SIX_MONTH })}>
              <a>6개월</a>
            </li>
            <li
              onClick={() => handleClickPreset(ActivePreset.TWELVE_MONTH)}
              className={cn({ 'bg-accent': activePreset === ActivePreset.TWELVE_MONTH })}>
              <a>12개월</a>
            </li>
            <li
              onClick={() => handleClickPreset(ActivePreset.TWENTY_FOUR_MONTH)}
              className={cn({ 'bg-accent': activePreset === ActivePreset.TWENTY_FOUR_MONTH })}>
              <a>24개월</a>
            </li>
          </ul>
        </div>
      )}
      <div>
        <div className="px-3 py-3 text-body1">직접 설정</div>
        <div className="flex w-fit flex-nowrap items-center justify-center rounded-mobile-stroke border px-2 py-2 text-body4 placeholder:text-body4">
          <input
            className="w-[90px] focus:outline-none focus-visible:outline"
            value={fromInputValue}
            onChange={handleFromInputChange}
            placeholder="YYYY/MM/DD"
          />
          ~
          <input
            className="w-[90px] focus:outline-none focus-visible:outline"
            value={toInputValue}
            onChange={handleToInputChange}
            placeholder="YYYY/MM/DD"
          />
        </div>
        <footer className="mt-4 flex justify-end gap-8">
          <PopoverClose>
            <Button
              className="w-[90px] rounded-[6px]"
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
