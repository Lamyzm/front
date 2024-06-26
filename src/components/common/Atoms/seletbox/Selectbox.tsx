'use client';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@Atoms/seletbox/CustomSelect';
import { LocalIcon } from '@icon/index';
import { BuildingSelectboxProps, DummyDataProps } from '@/types/common/selectbox';
import { SelectProps } from '@radix-ui/react-select';

/**
 * @param {string} lists: [{
 *  optionKey: string
 *  id: number
 * }]
 * 형식의 배열을 받아 셀렉트박스 반환.
 * @param {string} onChange: 현재 선택되어있는 옵션 {optionKey: string, id: number} 형식으로 반환.
 * @returns {*}
 */
export function Selectbox({
  lists,
  optionKey,
  size = 'addIconShort',
  icon = 'BuildingIcon',
  showIcon = true,
  onChange,
  disableSort,
  value,
  defaultId = 0,
  ...props
}: BuildingSelectboxProps & SelectProps) {
  const [buildingList, setBuildingList] = useState<DummyDataProps[] | undefined>(undefined);
  const [currentOption, setCurrentOption] = useState('');
  const isShowIcon = showIcon ? '' : 'hidden';
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const defaultValue = lists.find(option => option.id === defaultId)?.[optionKey] || '-';
  const controlledValue = value && JSON.parse(value)?.[optionKey];

  // 문자열 정렬
  useEffect(() => {
    if (disableSort) {
      setBuildingList(lists);
      // 정렬하지 않을 때는 외부에서 정한 초기 값을 따르면 됨.
      return;
    }
    const sortList = lists.slice().sort((a, b) => a[optionKey]?.localeCompare(b[optionKey]));
    setBuildingList(sortList);
    // 정렬 할 경우, 정렬에 맞는 초기 값 설정
    onChange({ title: sortList[0][optionKey], id: sortList[0]?.id.toString() });
  }, [lists]);

  // default value 설정
  useEffect(() => {
    if (buildingList?.length) {
      setCurrentOption(`{"title": "${buildingList[0][optionKey]}", "id": "${buildingList[0].id}"}`);
    }
  }, [buildingList]);

  return (
    <Select
      value={value || currentOption}
      defaultValue={defaultValue}
      onOpenChange={setIsOpen}
      onValueChange={value => {
        setCurrentOption(value);
        onChange(JSON.parse(value));
      }}
      {...props}>
      <SelectTrigger
        size={size}
        isOpen={isOpen}>
        <div className="flex items-center gap-3 truncate">
          <div className={isShowIcon}>
            <LocalIcon
              width={20}
              height={20}
              name={icon}
              className="fill-text-primary desktop:h-[24px] desktop:w-[24px]"
            />
          </div>
          <div className="truncate">
            <SelectValue>{controlledValue || undefined}</SelectValue>
          </div>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {buildingList?.map(item => (
            <SelectItem
              key={item.id}
              value={`{"title": "${item[optionKey]?.toString()}", "id": "${item.id}"}`}
              size={size}>
              {item[optionKey]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
