'use client'

import { useEffect, useMemo, useState } from 'react';
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
import { Card, CardFooter, CardHeader, CardTable, CardToolbar } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { 
    DataGridTable, 
    DataGridTableRowSelect,
    DataGridTableRowSelectAll, } from '@/components/ui/data-grid-table';
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

const RolePermissionsList = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState([{ id: 'create_date', desc: true}]);
    const [rowSelection, setRowSelection] = useState({});

    const [selectedRole, setSelectedRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [deletePermissionIds, setDeletePermissionIds] = useState([]);

    const { data: roleList } = useRoleSelectQuery();

    const fethPermissions = async ({
        pageIndex,
        pageSize,
        sorting,
        searchQuery,
    }) => {
        const sortField = sorting?.[0]?.id || 'create_date';
        const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

        const params = new URLSearchParams({
            page: String(pageIndex + 1),
            limit: String(pageSize),
            ...(sortField ? { sort: sortField, dir: sortDirection} : []),
            ...(searchQuery ? { query: searchQuery} : {}),
            ...(selectedRole && selectedRole !== 'all'
                ? {id_role: selectedRole}
                : {}),
        });

        const response = await apiFetch(
            `/api/user-management/rolepermissions?${params.toString()}`,
        );
        
        const result = await response.json()
        if(!response){
            throw new Error(
                result.message,
            );
        }
        return result;
    };

    const { data, isLoading } = useQuery({
        queryKey: [
            'user-permissions',
            pagination,
            sorting,
            searchQuery,
            selectedRole,
        ],

        queryFn: () =>
            fethPermissions({
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                sorting,
                filters:[
                    ...(selectedRole ? [{ id: 'role', value: selectedRole}] : []),
                ],

                searchQuery,
            }),
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry:1,
    });

    const handleRoleSelection = (id_role) => {
        setSelectedRole(id_role);
        setPagination({...pagination, pageIndex: 0});
    }

    useEffect(() => {
        const selectedRowIds = Object.keys(rowSelection);
        if(selectedRowIds.length > 0){
            // setDeletePermissionIds(selectedRowIds);
        }else{
            // setDeletePermissionIds([]);
        }
    }, [rowSelection]);

    const columns = useMemo(
        () => [
            {
                id: 'id',
                accessorKey: 'id',
                header: () => <DataGridTableRowSelectAll />,
                cell: ({ row }) => <DataGridTableRowSelect row={row} />,
                size: 27,
                enableSorting: false,
                meta:{
                    skeleton: <Skeleton className="size-5" />
                },
                enableResizing: false,
            },
            {
                id: 'roleName',
                accessorKey: 'roleName',
                header: ({column}) => (
                    <DataGridColumnHeader title='Role' column={column}/>
                ),
                cell: ({ row }) => {
                    const value = row.original.Role.name;
                    return (
                        <Badge variant='success' appearance='outline'>
                            {value}
                        </Badge>
                    )
                },
                size: 150,
                enableSorting: true,
                meta:{
                    headerTitle: 'Role',
                    skeleton: <Skeleton className="h-4 w-20" />,
                },
            },
            {
                id: 'permissionName',
                accessorKey: 'permissionName',
                header: ({column}) => (
                    <DataGridColumnHeader title='Permission' column={column}/>
                ), 
                cell: ({ row }) => {
                    const value = row.original.Permission.name || [];

                    return (
                        <Badge variant="secondary" appearance="outline">
                            {value}
                        </Badge>
                    )
                },
                size: 150,
                enableSorting: true,
                enableHiding: false,
                meta: {
                    headerTitle: 'min-w-[200px]',
                    skeleton: <Skeleton className="h-18 w-14" />,
                },
            },
            {
                id: 'create_date',
                accessorKey: 'create_date',
                header: ({column}) => (
                    <DataGridColumnHeader title='Create Date' column={column}/>   
                ),
                cell: (info) => {
                    const value = info.getValue()
                    return formatDateTime(new Date(value));
                },
                enableSorting: true,
                enableHiding: false,
                meta: {
                    headerTitle: 'Create Date',
                    skeleton: <Skeleton className="w-20 h-8"/>
                },
            },
            {
                id: 'create_by',
                accessorKey: 'create_by',
                header: ({column}) => (
                    <DataGridColumnHeader title='Create By' column={column}/>
                ),
                size:100,
                cell: ({ row }) =>{
                    const value = row.original;
                    return (
                        <Badge variant='secondary' appearance='outline'>
                            {value.create_by}
                        </Badge>
                    )
                },
                enableSorting: true,
                enableHiding: true,
                meta:{
                    headerTitle: 'Create By',
                    skeleton: <Skeleton className='w-20 h-7'/>
                }
            },
            {
                id: 'update_date',
                accessorKey: 'update_date',
                header: ({column}) => (
                    <DataGridColumnHeader title='Update Date' column={column}/>
                ),
                cell: (info) => {
                    const value = info.getValue();
                    return formatDateTime(new Date(value));
                },
                enableSorting: true,
                enableHiding: false,
                meta: {
                    headerTitle: 'Update Date',
                    skeleton: <Skeleton className='w-20 h-8'/>
                }
            },
            {
                id: 'update_by',
                accessorKey: 'update_by',
                header: ({column}) => (
                    <DataGridColumnHeader title='Update By' column={column}/>
                ),
                size: 100,
                cell: ({ row }) => {
                    const value = row.original;

                    return(
                        <Badge variant='info' appearance='outline'>
                            {value.update_by || '-'}
                        </Badge>
                    );
                },
                enableSorting: true,
                enableHiding: true,
                meta: {
                    headerTitle: 'Update By',
                    skeleton: <Skeleton className='w-20 h-7'/>
                }
            },
        ],
        []
    );

    const [columnOrder, setColumnOrder] = useState(columns.map((col) => col.id));

    const table = useReactTable({
        columns,
        data: data?.data || [],
        pageCount: Math.ceil((data?.pagination?.total || 0) / pagination.pageSize),
        getRowId: (row) => row.id,
        state: {
            pagination,
            sorting,
            columnOrder,
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onColumnOrderChange: setColumnOrder,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    const DataGridToolbar = () => {
        const [inputValue, setInputValue] = useState(searchQuery);

        const handleSearch = () => {
            setSearchQuery(inputValue);
            setPagination({ ...pagination, pageIndex: 0});
        };
    
        return (
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <div className="relative">
                        <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                        <Input placeholder='Search Role' value={inputValue} onChange={(e => setInputValue(e.target.value))}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} disabled={isLoading && true}
                            className='ps-9 w-full sm:w-64' 
                        />

                        {searchQuery.length > 0 && (
                            <Button mode="icon" variant="dim" className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                                onClick={() => setSearchQuery('')}
                            >
                                <X />
                            </Button>
                        )}
                    </div>
                    <Select
                        disabled={isLoading && true}
                        onValueChange={handleRoleSelection}
                        value={selectedRole || 'all'}
                        defaultValue="all"
                        >
                        <SelectTrigger className="w-full sm:w-36">
                        <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All roles</SelectItem>
                        {roleList?.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                            {role.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <CardToolbar>
                    {deletePermissionIds.length > 0 && (
                        <Button variant='destructive' onClick={() => {}}>
                            Delete (deletePermissionIds.length) Permissions    
                        </Button>
                    )}
                    <Button disabled={isLoading && true} onClick={() => {}}>
                        <Plus/>
                        Add Permissions
                    </Button>
                </CardToolbar>
            </CardHeader>
        );
    };
    
    return (
        <>
            <DataGrid
                table={table}
                recordCount={data?.pagination?.total || 0}
                isLoading={isLoading && true}
                tableLayout={{
                    columnsResizable: true,
                    columnsPinnable: true,
                    columnsMoveable: true,
                    columnsVisibility: true,
                }}
                tableClassNames= {{
                    edgeCell: 'px-5'
                }}
            >
                <Card>
                    <DataGridToolbar/>
                    <CardTable>
                        <ScrollArea>
                            <DataGridTable/>
                            <ScrollBar orientation='horizontal'/>
                        </ScrollArea>
                    </CardTable>
                    <CardFooter>
                        <DataGridPagination />
                    </CardFooter>
                </Card>
            </DataGrid>
        </>
    );
};

export default RolePermissionsList;