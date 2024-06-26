'use client';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { formatDateRangeToYYYY_MM_DD, formatDateToYYYY_MM_DD } from '@/utils';
import DateInputAtom from '@Monocles/date-input/DateInputAtom';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import ContractEditConfirmDialog from './ContractEditConfirmDialog';
import ContractVacantConfirmDialog from './ContractVacantConfirmDialog';

export enum ContractEditState {
  VACANT = 'vacanct',
  CONTRACT_INFO = 'contract info',
  CONTRACT_EDIT = 'contract edit',
  CONTRACT_RENEWAL = 'contract renewal',
}

export default function ContractEditDialogContent({
  closeDialog,
  isVacant,
  roomName,
  fromDate,
  toDate,
  deposit = '',
  rent = '',
}: {
  closeDialog: () => void;
  isVacant?: boolean;
  roomName?: string;
  fromDate?: Date;
  toDate?: Date;
  deposit?: string;
  rent?: string;
}) {
  const [contractDialogState, setContractDialogState] = useState<ContractEditState>(ContractEditState.CONTRACT_INFO);
  const [editedFromDate, setEditedFromDate] = useState<Date | undefined>(fromDate);
  const [editedToDate, setEditedToDate] = useState<Date | undefined>(toDate);
  const [editedDeposit, setEditedDeposit] = useState<string>(deposit);
  const [editedRent, setEditedRent] = useState<string>(rent);
  const [renewalToDate, setRenewalTo] = useState<Date | undefined>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const closeConfirnDialog = () => {
    setIsConfirmOpen(false);
  };

  const checkIsDiff = (newFrom: Date | undefined, newTo: Date | undefined, newDeposit: string, newRent: string) => {
    return !(
      formatDateToYYYY_MM_DD(fromDate) === formatDateToYYYY_MM_DD(newFrom) &&
      formatDateToYYYY_MM_DD(toDate) === formatDateToYYYY_MM_DD(newTo) &&
      deposit === newDeposit &&
      rent === newRent
    );
  };

  const handleAddContractClick = () => {
    console.log(`===== ${roomName} 계약 정보 추가됨 =====`);
    closeDialog();
  };

  const handleVacantClick = () => {
    console.log(`===== ${roomName} 공실로 설정됨 =====`);
    closeDialog();
    closeConfirnDialog();
  };

  const handleSubmitEditClick = () => {
    console.log(`===== ${roomName} 수정사항 저장됨 =====`);
    closeDialog();
  };

  const handleCancelRenewalEditClick = () => {
    setEditedFromDate(fromDate);
    setEditedToDate(toDate);
    setEditedDeposit(deposit);
    setEditedRent(rent);
    setContractDialogState(ContractEditState.CONTRACT_INFO);
  };

  const handleRenewalClick = () => {
    setContractDialogState(ContractEditState.CONTRACT_RENEWAL);
  };

  const handleSumbitRenewalClick = () => {
    console.log(`===== ${roomName} 재계약 저장됨 =====`);
    closeDialog();
    closeConfirnDialog();
  };

  const handleFromChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    setEditedFromDate(newDate);

    // 현재 계약 정보 상태라면 계약 정보 수정 상태로 변경하기 위핸 로직
    if (contractDialogState !== ContractEditState.CONTRACT_INFO) return;
    if (checkIsDiff(newDate, editedToDate, editedDeposit, editedRent)) {
      setContractDialogState(ContractEditState.CONTRACT_EDIT);
    } else {
      setContractDialogState(ContractEditState.CONTRACT_INFO);
    }
  };
  const handleToChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    setEditedToDate(newDate);

    // 현재 계약 정보 상태라면 계약 정보 수정 상태로 변경하기 위핸 로직
    if (contractDialogState !== ContractEditState.CONTRACT_INFO) return;
    if (checkIsDiff(editedFromDate, newDate, editedDeposit, editedRent)) {
      setContractDialogState(ContractEditState.CONTRACT_EDIT);
    } else {
      setContractDialogState(ContractEditState.CONTRACT_INFO);
    }
  };

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDeposit(e.target.value);

    // 현재 계약 정보 상태라면 계약 정보 수정 상태로 변경하기 위핸 로직
    if (contractDialogState !== ContractEditState.CONTRACT_INFO) return;
    if (checkIsDiff(editedFromDate, editedToDate, e.target.value, editedRent)) {
      setContractDialogState(ContractEditState.CONTRACT_EDIT);
    } else {
      setContractDialogState(ContractEditState.CONTRACT_INFO);
    }
  };

  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedRent(e.target.value);

    // 현재 계약 정보 상태라면 계약 정보 수정 상태로 변경하기 위핸 로직
    if (contractDialogState !== ContractEditState.CONTRACT_INFO) return;
    if (checkIsDiff(editedFromDate, editedToDate, editedDeposit, e.target.value)) {
      setContractDialogState(ContractEditState.CONTRACT_EDIT);
    } else {
      setContractDialogState(ContractEditState.CONTRACT_INFO);
    }
  };

  const handleRenewalToChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    setRenewalTo(newDate);
  };

  const ButtonGroupByState = (state: ContractEditState): React.ReactNode => {
    switch (state) {
      case ContractEditState.VACANT:
        return (
          <ContractEditConfirmDialog
            dialogProps={{ open: isConfirmOpen, onOpenChange: setIsConfirmOpen }}
            title={'입력한 계약 정보가 맞습니까?'}
            roomName={roomName}
            contractPeriod={formatDateRangeToYYYY_MM_DD(editedFromDate, editedToDate)}
            rent={`${Number(editedDeposit).toLocaleString()} / ${Number(editedRent).toLocaleString()}만 원`}
            triggerButton={
              <Button className="px-6 py-3 text-body3 desktop:w-[193px] desktop:py-4 desktop:text-body1">
                계약 정보 추가
              </Button>
            }
            onSubmitClick={handleAddContractClick}
            onCancelClick={() => setIsConfirmOpen(false)}
          />
        );
      case ContractEditState.CONTRACT_INFO:
        return (
          <>
            <ContractVacantConfirmDialog
              dialogProps={{ open: isConfirmOpen, onOpenChange: setIsConfirmOpen }}
              triggerButton={
                <Button
                  className="px-6 py-3 text-body3 desktop:w-[193px] desktop:py-4 desktop:text-body1"
                  variant="orange">
                  공실로 설정하기
                </Button>
              }
              onSubmitClick={handleVacantClick}
              onCancelClick={() => setIsConfirmOpen(false)}
            />
            <Button
              className="px-6 py-3 text-body3 desktop:w-[193px] desktop:py-4 desktop:text-body1"
              onClick={handleRenewalClick}>
              재계약하기
            </Button>
          </>
        );
      case ContractEditState.CONTRACT_EDIT:
        return (
          <>
            <Button
              onClick={handleCancelRenewalEditClick}
              variant="outline"
              className="px-6 py-3 text-body3 desktop:w-[193px] desktop:py-4 desktop:text-body1">
              취소하기
            </Button>
            <ContractEditConfirmDialog
              dialogProps={{ open: isConfirmOpen, onOpenChange: setIsConfirmOpen }}
              title={'계약 정보를 변경하시겠습니까?'}
              roomName={roomName}
              contractPeriod={formatDateRangeToYYYY_MM_DD(editedFromDate, editedToDate)}
              rent={`${Number(editedDeposit).toLocaleString()} / ${Number(editedRent).toLocaleString()}만 원`}
              triggerButton={
                <Button
                  variant="secondary"
                  className="px-6 py-3 text-body3 desktop:w-[193px] desktop:py-4 desktop:text-body1">
                  저장하기
                </Button>
              }
              onSubmitClick={handleSubmitEditClick}
              onCancelClick={() => setIsConfirmOpen(false)}
            />
          </>
        );
      case ContractEditState.CONTRACT_RENEWAL:
        return (
          <>
            <Button
              onClick={handleCancelRenewalEditClick}
              variant="ghost"
              className="px-6 py-3 text-body3 desktop:w-[193px] desktop:py-4 desktop:text-body1">
              취소하기
            </Button>
            <ContractEditConfirmDialog
              dialogProps={{ open: isConfirmOpen, onOpenChange: setIsConfirmOpen }}
              title={'재계약을 진행하시겠습니까?'}
              roomName={roomName}
              contractPeriod={formatDateRangeToYYYY_MM_DD(editedToDate, renewalToDate)}
              rent={`${Number(editedDeposit).toLocaleString()} / ${Number(editedRent).toLocaleString()}만 원`}
              triggerButton={
                <Button
                  variant="secondary"
                  className="px-6 py-3 text-body3 desktop:w-[193px] desktop:py-4 desktop:text-body1">
                  재계약하기
                </Button>
              }
              onSubmitClick={handleSumbitRenewalClick}
              onCancelClick={() => setIsConfirmOpen(false)}
            />
          </>
        );
    }
  };

  useEffect(() => {
    if (!isVacant) return;
    setContractDialogState(ContractEditState.VACANT);
  }, [isVacant]);

  return (
    <>
      <div className="flex flex-col gap-6 bg-gray-50 px-6 py-8 desktop:px-10">
        <h4 className="text-h4 text-primary">미왕빌딩 A동 201호</h4>
        <div className="flex flex-col gap-3">
          <Label className="text-body2">계약 기간</Label>
          <div className="flex items-center gap-1 desktop:gap-5">
            {contractDialogState === ContractEditState.CONTRACT_RENEWAL ? (
              <div>{formatDateToYYYY_MM_DD(editedToDate)}</div>
            ) : (
              <DateInputAtom
                mode="single"
                selected={contractDialogState === ContractEditState.CONTRACT_INFO ? fromDate : editedFromDate}
                onSelect={handleFromChange}
                className={cn({
                  'border-green-500': formatDateToYYYY_MM_DD(editedFromDate) !== formatDateToYYYY_MM_DD(fromDate),
                })}
              />
            )}
            ~
            {contractDialogState === ContractEditState.CONTRACT_RENEWAL ? (
              <DateInputAtom
                mode="single"
                selected={renewalToDate}
                onSelect={handleRenewalToChange}
              />
            ) : (
              <DateInputAtom
                mode="single"
                selected={contractDialogState === ContractEditState.CONTRACT_INFO ? toDate : editedToDate}
                onSelect={handleToChange}
                className={cn({
                  'border-green-500': formatDateToYYYY_MM_DD(editedToDate) !== formatDateToYYYY_MM_DD(toDate),
                })}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label className="text-body2">보증금 / 임대료</Label>
          <div className="flex items-center gap-3">
            <Input
              value={contractDialogState === ContractEditState.CONTRACT_INFO ? deposit : editedDeposit}
              onChange={handleDepositChange}
              className={cn('w-[80px] desktop:w-[100px]', { 'border-green-500': editedDeposit !== deposit })}
            />
            /
            <Input
              value={contractDialogState === ContractEditState.CONTRACT_INFO ? rent : editedRent}
              onChange={handleRentChange}
              className={cn('w-[50px] desktop:w-[65px]', { 'border-green-500': editedRent !== rent })}
            />
            만 원
          </div>
        </div>
      </div>
      <DialogFooter
        className={cn('flex flex-row flex-wrap items-end justify-between border-t px-8 py-4 desktop:px-10', {
          'justify-end': contractDialogState === ContractEditState.VACANT,
        })}>
        {ButtonGroupByState(contractDialogState)}
      </DialogFooter>
    </>
  );
}
