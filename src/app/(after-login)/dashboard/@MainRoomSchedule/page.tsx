import RoomBadge from '@Atoms/badge/RoomBadge';
import { ContractProgress } from '@Monocles/progress-bar/ContractProgress';
import { NextIconButton } from '@Atoms/buttons/NextIconButton';
import ReviewTrackProgress from '@Monocles/progress-bar/ReviewTrackProgress';
import { fetchJsonData, baseApis, fetchServerJsonData } from '@/services/api';
import { CONTRACT_STATUSES, QueryOptions } from '@/constants/index';
import { dashboardPageType } from '@/types/common/pageTypes';
import dayjs from 'dayjs';
import MainRoomScheduleLoading from '@/app/(after-login)/dashboard/@MainRoomSchedule/loading';
function formatDate(date: string | dayjs.Dayjs) {
  return dayjs(date).format('YYYY.MM.DD');
}

// 계약 기간 백분율로 계산.
function calculateProgressPercentage(start_date: string, end_date: string): number {
  const startDate = dayjs(start_date);
  const endDate = dayjs(end_date);
  const currentDate = dayjs();

  const totalDuration = endDate.diff(startDate);
  const elapsedDuration = currentDate.diff(startDate);
  const progress = Math.floor((elapsedDuration / totalDuration) * 100);
  return progress < 0 ? 0 : progress;
}

// 계약정보 객체로 반환
function createContractProgress({
  start_date,
  end_date,
  status,
  statusDescription,
}: {
  start_date: string;
  end_date: string;
  status: string;
  statusDescription: string;
}) {
  const start = formatDate(start_date);
  const end = formatDate(end_date);
  const current = formatDate(dayjs());
  const progressPercentage = calculateProgressPercentage(start_date, end_date);
  return {
    start,
    end,
    current,
    progressPercentage,
    status,
    statusDescription,
  };
}

const mockRepresentRoom = {
  id: 1,
  name: 'RoomA빌딩',
};

const mockContractPeriod = {
  contracts: {
    info_list: [
      {
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        contract_status: 'ACTIVE',
      },
      {
        start_date: '2022-01-01',
        end_date: '2022-12-31',
        contract_status: 'COMPLETED',
      },
    ],
  },
};

const mockEvaluationProgress = {
  my: [
    {
      evaluation_progress: 75,
    },
    {
      evaluation_progress: 80,
    },
  ],
};

export default async function Page({ searchParams }: dashboardPageType) {
  const buildingName = searchParams && searchParams[QueryOptions.BuildingName];
  const buildingId = searchParams && searchParams[QueryOptions.Id];

  // 계약기간

  try {
    // Mocking data instead of fetching
    const fetchedRepresentRoom = mockRepresentRoom;
    const fetchedContractPeriod = mockContractPeriod;
    const evaluationProgress = mockEvaluationProgress;

    // Original fetching code
    // const representRoomUrl = `/api/buildings/${buildingId}/rooms/represent`;
    // const fetchedRepresentRoom = await fetchServerJsonData(representRoomUrl, { cache: 'default', method: 'GET' });
    // console.log(representRoomUrl);
    // const contractPeriodUrl = `/api/buildings/${buildingId}/rooms/${fetchedRepresentRoom?.id}`;
    // const fetchedContractPeriod = await fetchServerJsonData(contractPeriodUrl, { cache: 'default', method: 'GET' });
    // console.log(contractPeriodUrl);
    // const evaluationProgressUrl = `/api/buildings/${buildingId}/rooms/${fetchedRepresentRoom?.id}/yearly-score-interval-month?yearMonth=2024-06`;
    // const evaluationProgress = await fetchServerJsonData(evaluationProgressUrl, { cache: 'default', method: 'GET' });
    // console.log(evaluationProgressUrl);

    const contractStatus = fetchedContractPeriod.contracts?.info_list[0]?.contract_status as string;
    const contractDateInfo = createContractProgress({
      start_date: fetchedContractPeriod.contracts?.info_list[0]?.start_date,
      end_date: fetchedContractPeriod.contracts?.info_list[0]?.end_date,
      status: CONTRACT_STATUSES[contractStatus] ? CONTRACT_STATUSES[contractStatus].status : 'UNKNOWN',
      statusDescription: CONTRACT_STATUSES[contractStatus] ? CONTRACT_STATUSES[contractStatus].description : 'UNKNOWN',
    });

    const representRoomName = `${buildingName ?? ''} ${fetchedRepresentRoom?.name ?? ''}`;
    return (
      <div className="rounded-container bg-white px-[40px] py-[32px]">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-h4">대표 호실 스케줄</h4>
          <NextIconButton shape={'circle'} />
        </div>
        <RoomBadge
          roomName={representRoomName}
          className="mb-6 w-fit min-w-9"
        />
        <div className="contract-container flex flex-col gap-3">
          <div>
            <p className="schedule-title">계약 기간</p>
            <ContractProgress
              // value={contractDateInfo?.progressPercentage}
              value={70}
              percentageFont={'body1'}
              periodFontClassName="text-gray-400"
              contractDate={contractDateInfo}
            />
          </div>
          <div>
            <p className="schedule-title">평가 진행률</p>
            <ReviewTrackProgress
              value={evaluationProgress?.my[0].evaluation_progress}
              trackFontClass="desktop:text-body4"
            />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.log(err);
    // TODO: 에러시 에러 컴포넌트 따로 반환해야함
    return <MainRoomScheduleLoading />;
  }
}
