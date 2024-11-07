import LineChartComp from '@/app/(after-login)/dashboard/@RatingTrends/_components/LineChartComp';
import {
  MainRoomSetting,
  MainRoomSettingComplete,
  MainRoomSettingFailed,
} from '@/app/(after-login)/dashboard/@RatingTrends/_components/Modal';
import { dashboardPageType } from '@/types/common/pageTypes';
import { QueryOptions } from '@/constants/index';
import { fetchServerJsonData } from '@/services/api';

interface AvgByMonth {
  selected_month: string;
  total_avg: number;
  evaluation_progress: number;
  facility_avg: number;
  management_avg: number;
  complaint_avg: number;
}

interface RepresentRoom {
  room_id: number;
  room_name: string;
  all_avg_by_month_list: AvgByMonth[];
}

const mockRepresentRoom = {
  room_id: 1,
  room_name: 'Room A',
  all_avg_by_month_list: [
    {
      selected_month: '2023-01',
      total_avg: 80,
      evaluation_progress: 75,
      facility_avg: 85,
      management_avg: 90,
      complaint_avg: 70,
    },
    {
      selected_month: '2023-02',
      total_avg: 82,
      evaluation_progress: 78,
      facility_avg: 88,
      management_avg: 92,
      complaint_avg: 72,
    },
    // ...more mock data
  ],
};

const mockRoomsYearScore: RepresentRoom[] = [
  {
    room_id: 1,
    room_name: 'Room A',
    all_avg_by_month_list: [
      {
        selected_month: '2023-01',
        total_avg: 80,
        evaluation_progress: 75,
        facility_avg: 85,
        management_avg: 90,
        complaint_avg: 70,
      },
      {
        selected_month: '2023-02',
        total_avg: 82,
        evaluation_progress: 78,
        facility_avg: 88,
        management_avg: 92,
        complaint_avg: 72,
      },
      // ...more mock data
    ],
  },
  {
    room_id: 2,
    room_name: 'Room B',
    all_avg_by_month_list: [
      {
        selected_month: '2023-01',
        total_avg: 75,
        evaluation_progress: 70,
        facility_avg: 80,
        management_avg: 85,
        complaint_avg: 65,
      },
      {
        selected_month: '2023-02',
        total_avg: 77,
        evaluation_progress: 73,
        facility_avg: 83,
        management_avg: 87,
        complaint_avg: 67,
      },
      // ...more mock data
    ],
  },
  // ...more mock data
];

// 모든호실 연간 평균치
export default async function Page({ searchParams }: dashboardPageType) {
  const buildingName = searchParams && searchParams[QueryOptions.BuildingName];
  const buildingId = searchParams && searchParams[QueryOptions.Id];

  try {
    // Mocking data instead of fetching
    const representRoom = mockRepresentRoom;
    const roomsYearScore = mockRoomsYearScore;

    // Original fetching code
    // const representRoomUrl = `/api/buildings/${buildingId}/rooms/represent`;
    // const representRoom = await fetchServerJsonData(representRoomUrl, {
    //   cache: 'no-store',
    //   method: 'GET',
    // });
    // const roomsYearScoreUrl = `/api/buildings/${buildingId}/my-rooms-year-score`;
    // const roomsYearScore: RepresentRoom[] = await fetchServerJsonData(roomsYearScoreUrl, {
    //   cache: 'no-store',
    //   method: 'GET',
    // });

    return (
      <>
        <div className="flex flex-row gap-6 after:h-4 after:content-[''] desktop:flex-col">
          {roomsYearScore &&
            roomsYearScore.map(val => {
              return (
                <LineChartComp
                  mainRoom={representRoom.room_id === val.room_id}
                  key={val.room_id}
                  val={val}
                  roomId={val.room_id}
                  roomName={val.room_name}
                  buildingName={buildingName}
                />
              );
            })}
        </div>
        {/* 모달 컴포넌트 */}
        <MainRoomSetting />
        <MainRoomSettingComplete />
        <MainRoomSettingFailed />
      </>
    );
  } catch (err) {
    return null;
  }
}
