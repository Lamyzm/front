'use client';

import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateToYYYY_MM_DD } from '@/utils';
import { BookmarkIcon } from '@/asset/Icons';
import RatingDetailDialog from './RatingDetailDialog';
import RatingDetailPagination from './RatingDetailPagination';
import { dummyData } from './dummyData';

export enum RatingCategory {
  FACILITY = '시설 평가',
  MANAGEMENT = '관리 평가',
  COMPLAINT = '민원 평가',
}

export type RatingDetail = {
  id: string;
  category: RatingCategory;
  score: number;
  content: string;
  building: string;
  room: string;
  isBookmark: boolean;
  ratingDate: Date;
};

export enum RatingDetailTableAccessorKey {
  CATEGORY = 'category',
  SCORE = 'score',
  CONTENT = 'content',
  BUILDING = 'building',
  ROOM = 'room',
  IS_BOOKMARK = 'isBookmark',
  RATING_DATE = 'ratingDate',
}

export const columns: ColumnDef<RatingDetail, unknown>[] = [
  {
    accessorKey: RatingDetailTableAccessorKey.CATEGORY,
    header: () => <div className="pl-2.5 desktop:pl-5">유형</div>,
    cell: ({ row }) => <div className="pl-2.5 desktop:pl-5">{row.getValue(RatingDetailTableAccessorKey.CATEGORY)}</div>,
  },
  {
    accessorKey: RatingDetailTableAccessorKey.SCORE,
    header: () => <div>점수</div>,
    cell: ({ row }) => <div>{row.getValue(RatingDetailTableAccessorKey.SCORE)}점</div>,
  },
  {
    accessorKey: RatingDetailTableAccessorKey.CONTENT,
    header: () => <div>평가 내용</div>,
    cell: ({ row }) => <div>{row.getValue(RatingDetailTableAccessorKey.CONTENT)}</div>,
  },
  {
    accessorKey: RatingDetailTableAccessorKey.BUILDING,
    header: () => <div>건물</div>,
    cell: ({ row }) => <div>{row.getValue(RatingDetailTableAccessorKey.BUILDING)}</div>,
  },
  {
    accessorKey: RatingDetailTableAccessorKey.ROOM,
    header: () => <div>호실</div>,
    cell: ({ row }) => <div>{row.getValue(RatingDetailTableAccessorKey.ROOM)}</div>,
  },
  {
    accessorKey: RatingDetailTableAccessorKey.IS_BOOKMARK,
    header: () => <BookmarkIcon className="w-5" />,
    cell: ({ row }) => (
      <BookmarkIcon
        className="w-5 cursor-pointer hover:fill-text-primary active:scale-95"
        fill={row.getValue(RatingDetailTableAccessorKey.IS_BOOKMARK) ? 'text-text-primary' : 'none'}
      />
    ),
  },
  {
    accessorKey: RatingDetailTableAccessorKey.RATING_DATE,
    header: () => <div>평가 날짜</div>,
    cell: ({ row }) => <div>{formatDateToYYYY_MM_DD(row.getValue(RatingDetailTableAccessorKey.RATING_DATE))}</div>,
  },
];

const PAGE_ROW_LIMIT = 10; // 데이터 10개 씩 보여줌.
export const FIRST_PAGE_NUM = 1; // 1부터 셈

export default function RatingDetailDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRow, setSelectedRow] = useState<Row<RatingDetail> | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(FIRST_PAGE_NUM);
  const pageNum = Math.round(dummyData.length / PAGE_ROW_LIMIT);

  const table = useReactTable({
    data: dummyData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage - FIRST_PAGE_NUM, // page는 FIRST_PAGE_NUM부터 시작하지만 index는 0부터 시작
        pageSize: 10,
      },
    },
  });

  const handleRowClick = (newSelectedRow: Row<RatingDetail>) => {
    setIsDialogOpen(true);
    setSelectedRow(newSelectedRow);
  };

  return (
    <div className="w-full">
      <RatingDetailDialog
        selectedRow={selectedRow}
        isDialogOpen={isDialogOpen}
        onDialogOpen={setIsDialogOpen}
      />
      <div className="rounded-container border bg-white">
        <Table>
          <TableHeader className="h-10 text-text-secondary desktop:h-16">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-body3 desktop:text-h4">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  onClick={() => handleRowClick(row)}
                  className="h-12 cursor-pointer text-text-primary desktop:h-16"
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      className={cell.column.id === RatingDetailTableAccessorKey.SCORE ? 'text-body1' : 'text-body2'}
                      key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  조회된 평가 내용이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8 flex items-center justify-center space-x-2 py-4 desktop:mt-10">
        {pageNum > 0 && (
          <RatingDetailPagination
            currentPage={currentPage}
            pageNum={pageNum}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
