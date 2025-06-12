'use client';

import { useMemo, useState } from 'react';
import { redirect } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronRight, Plus, Search, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatDate, formatDateTime, getInitials } from '@/lib/helpers';

import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTable } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoleSelectQuery } from '../../roles/hooks/use-role-select-query';
import { Avatar } from '@/components/ui/avatar';

const UserList = () => {
  const [pagination,  setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: 'created_at', desc: true}]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  
  const { data: roleList} = useRoleSelectQuery();

  const fetchUsers = async ({
    pageIndex,
    pageSize,
    sorting,
    searchQuery,
    selectedRole,
  }) => {
    const sortField = sorting?.[0]?.id || '';
    const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

    const params = new URLSearchParams({
      page: String(pageIndex + 1),
      limit: String(pageSize),
      ...(sortField ? {sort: sortField, dir: sortDirection} : {}),
      ...(searchQuery ? {query: searchQuery} : {}),
      ...(selectedRole && selectedRole !== 'all'
        ? { id_role: selectedRole} 
        : {}),
    });

    const response = await apiFetch(
      `api/user-management/users?${params.toString()}`,
    );

    if(!response.ok){
      throw new Error(
        'Oops! Something didn’t go as planned, Please try again in a momment.',
      );
    }

    return response.json();
  };

  const {data, isLoading} = useQuery({
    queryKey:[
      'user-users',
      pagination,
      sorting,
      searchQuery,
      selectedRole,
    ],

    queryFn: () =>
      fetchUsers({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        searchQuery,
        selectedRole,
      }),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const handleRoleSelection = (id_role) =>{
    setSelectedRole(id_role);
    setPagination({...pagination, pageIndex: 0});
  };

  const handleRowClick = (row) =>{
    const userId = row.id;
    redirect(`/user-management/users/${userId}`);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'username',
        id: 'username',
        header: ({ column }) =>(
          <DataGridColumnHeader
            title='User'
            visibility={true}
            column={column}
          />
        ),

        cell: ({row}) => {
          const user = row.original;
          const initials = getInitials(user.username);

          return(
            <div className='flex items-center gap-3'>
              <Avatar className="size-8">

              </Avatar>
              <div className='space-y-px'>
                <div className='font-medium text-sm'>${user.role.name}</div>
                <div className='text-muted-foreground text-xs'>
                  ${user.username}
                </div>
              </div>
            </div>
          );
        },
        size: 300,
        meta: {
          headerTitle: 'Name',
          Skeleton: (
            <div className='flex items-center gap-3'>
              <Skeleton className="size-8 rounded-full"/>
              <div className='space-y-1'>
                <Skeleton className="h-4 w-40"/>
                <Skeleton className="h-4 w-24"/>
              </div>
            </div>
          ),
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'role_name',
        id: 'role_name',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Role"
            visibility={true}
            column={column}
          />
        ),
      }
    ],
    []
  );

  const [columnOrder, setColumnOrder] = useState(
    columns.map((column) => column.id),
  );

  const table = useReactTable({
    columns,
    data: data?.data || [],
    pageCount: Math.ceil((data?.pagination.total || 0) / pagination.pageSize),
    getRowId: (row) => row.id,
    state:{
      pagination,
      sorting,
      columnOrder,
    },
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFileteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const DataGridToolbar = () => {
    const [inputValue, setInputValue] = useState(searchQuery);

    const handleSearch = () => {
      setSearchQuery(inputValue);
      setPagination({...pagination, pageIndex: 0});
    };

    return(
      <CardHeader className="flex-col flex-wrap sm:flex-row items-stretch sm:items-center py-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search users"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isLoading}
              className="ps-9 w-full sm:40 md:w-64"
            />

            {searchQuery.length > 0 && (
              <Button
                mode="icon"
                variant="dim"
                className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={()=> setSearchQuery('')}
              >
                <X/>
              </Button>
            )}
          </div>
          <Select
            onValueChange={handleRoleSelection}
            value={selectedRole || 'all'}
            defaultValue="all"
            disabled={isLoading}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Filter by role"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {roleList?.map((map) => (
                <SelectItem key={role.id} value={value.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center justify-end'>
              <Button
                disabled={isLoading && true}
                onClick={() => {

                }}
              >
                <Plus/>
                Add User
              </Button>
        </div>
      </CardHeader>
    );
  };

  return(
    <>
      <DataGrid
        table={table}
        recordCount={data?.pagination.total || 0}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        tableLayout={{
          columnResizable: true,
          columnsPinnable: true,
          columnsMovable: true,
          columnsVisibility: true,
        }}
        tableClassName={{
          edgeCell: 'px-5',
        }}
      >
        <Card>
          <DataGridToolbar>
            <CardTable>
              <ScrollArea>
                <DataGridTable/>
                <ScrollBar orientation='horizontal'/>
              </ScrollArea>
            </CardTable>
          </DataGridToolbar>
        </Card>
      </DataGrid>
    </>
  );
};

export default UserList;

