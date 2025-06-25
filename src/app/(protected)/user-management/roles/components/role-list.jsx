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
import { ChevronRight, Ellipsis, Plus, Search, X } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import RoleEditDialog from './role-edit-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const RolesList = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState([{id: 'created_at', desc: true}]);
    const [rowSelection, setRowSelection] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const [editRole, setEditRole] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const fetchRoles = async ({
        pageIndex,
        pageSize,
        sorting,
        searchQuery,
    }) => {
        const sortField = sorting?.[0]?.id || '';
        const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

        const params = new URLSearchParams({
            page: String(pageIndex + 1),
            limit: String(pageSize),
            ...(sortField ? { sort: sortField, dir: sortDirection} : {}),
            ...(searchQuery ? { query: searchQuery } : {}),
        });

        const response = await apiFetch(
            `/api/user-management/roles?${params.toString()}`,
        );

        const result = await response.json()
        if(!response.ok){
            throw new Error(
                result.message,
            );
        }
        return result;
    }

    const { data, isLoading } = useQuery({
        queryKey: ['user-roles', pagination, sorting, searchQuery],
        queryFn: () =>
            fetchRoles({
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                sorting,
                searchQuery,
            }),
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    });

    const columns = useMemo(
        () => [
            {
                id: 'name',
                accessorKey: 'name',
                header: ({column}) => (
                    <DataGridColumnHeader title='Role' column={column}/>
                ),
                cell: ({ row }) => {
                    const value = row.original;

                    return(
                        <Badge variant='secondary' appearance='outline'>
                            {value.name}
                        </Badge>
                    );
                },
                size: 150,
                enableSorting: true,
                enableHiding: false,
                meta: {
                    headerTitle: 'Role',
                    skeleton: <Skeleton className='w-28 h-7'/>
                },
            },
            {
                id: 'permission',
                accessorKey: 'RolePermission',
                header: ({column}) => (
                    <DataGridColumnHeader title='Permission' column={column}/>
                ),
                cell: ({row}) => {
                    const value = row.original.RolePermission;

                    if(!value || value.length === 0){
                        return <span>-</span>
                    }

                    const displayedPermissions = value.slice(0, 3);
                    const extraPermissionsCount = value.length - displayedPermissions.length;

                    return(
                        <div className='flex items-center gap-1 flex-wrap'>
                            {displayedPermissions.map((value, index) => (
                                <Badge key={index} variant='secondary' appearance='stroke'>
                                    {value.Permission.name}
                                </Badge>
                            ))}
                            {extraPermissionsCount > 0 && (
                                <span className='text-muted-foreground text-xs ms-1'>{`${extraPermissionsCount} more`}</span>
                            )}
                        </div>
                    );
                },
                minSize: 350,
                enableSorting: false,
                enableHiding: false,
                meta: {
                    headerTitle: 'Permission',
                    skeleton: <Skeleton className='w-44 h-7'/>
                },
            },
            {
                id: 'created_at',
                accessorKey: 'created_at',
                header: ({column}) => (
                    <DataGridColumnHeader title='Create Date' column={column}/>
                ),
                cell: ({row}) => {
                    const value = row.original.created_at;
                    return formatDateTime(new Date(value));
                },
                enableSorting: true,
                enableHiding: false,
                meta: {
                    headerTitle: 'Create Date',
                    skeleton: <Skeleton className='w-20 h-8'/>
                }
            },
            {
                id: 'created_by',
                accessorKey: 'created_by',
                header: ({column}) => (
                    <DataGridColumnHeader title='Create By' column={column}/>
                ),
                cell: ({row}) => {
                    const value = row.original;
                    return (
                        <Badge variant='success' appearance='outline'>
                            {value.created_by}
                        </Badge>
                    )
                },
                size: 100,
                enableSorting: true,
                enableHiding: false,
                meta: {
                    headerTitle: 'Create By',
                    skeleton: <Skeleton className='w-20 h-7'/>
                }
            },
            {
                id: 'updated_at',
                accessorKey: 'updated_at',
                header: ({column}) => (
                    <DataGridColumnHeader title='Update Date' column={column}/>
                ),
                cell: ({row}) => {
                    const value = row.original.updated_at;
                    return formatDateTime(new Date(value));
                },
                enableSorting: true,
                enableHiding: false,
                meta: {
                    headerTitle: 'Update Date',
                    skeleton: <Skeleton className='w-28 h-7'/>
                }
            },
            {
                id: 'updated_by',
                accessorKey: 'updated_by',
                header: ({column}) => (
                    <DataGridColumnHeader title='Update By' column={column}/>
                ),
                cell: ({row}) => {
                    const value = row.original;
                    return(
                        <Badge variant='warning' appearance='outline'>
                            {value.updated_by || '-'}
                        </Badge>
                    )
                },
                size: 100,
                enableSorting: true,
                enableHiding: false,
                meta: {
                    headerTitle: 'Update By',
                    skeleton: <Skeleton className='w-20 h-7'/>
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({row}) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="h-7 w-7" mode='icon' variant='ghost'>
                                <Ellipsis/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side='bottom' align='start'>
                            <DropdownMenuItem onClick={() => {
                                setEditRole(row.original)
                                setEditDialogOpen(true);
                            }}>
                                Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>
                                Delete Role
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
                size: 75,
                enableSorting: false,
                enableResizing: false,
                meta: {
                    skeleton: <Skeleton className='size-5'/>
                }
            }
        ],
        [],
    );

    const table = useReactTable({
        columns,
        data: data?.data || [],
        pageCount: Math.ceil((data?.pagination?.total || 0) / pagination.pageSize),
        getRowId: (row) => row.id,
        state: {
            pagination,
            sorting,
        },
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
        const [inputValue, setInputValue] = useState(searchQuery)

        const handleSearch = () => {
            setSearchQuery(inputValue)
            setPagination({...pagination, pageIndex: 0});
        };

        return (
            <CardHeader className='py-5'>
                <div className='flex items-center gap-2.5'>
                    <div className='relative'> 
                        <Search className='size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2'/>
                        <Input placeholder='Search roles' value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            disabled={isLoading && true}
                            className='ps-9 w-full md:w-64'
                        />

                        {searchQuery.length > 0 && (
                            <Button mode='icon' variant='dim' className='absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6'
                                onClick={() => setSearchQuery('')}
                            >
                                <X/>
                            </Button>

                        )}
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <Button disabled={isLoading && true} onClick={() => {
                        setEditRole(null)
                        setEditDialogOpen(true)
                    }}>
                        <Plus/>
                        Add Role
                    </Button>
                </div>
            </CardHeader>
        );
    };

    return (
        <>
            <DataGrid
                table={table}
                recordCount={data?.pagination?.total || 0}
                isLoading={isLoading}
                tableLayout={{
                    columnsResizable: true,
                    columnsPinnable: true,
                    columnsMovable: true,
                }}
                tableClassName={{
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
                        <DataGridPagination/>
                    </CardFooter>
                </Card>
            </DataGrid>

            <RoleEditDialog
                open={editDialogOpen}
                closeDialog={() => setEditDialogOpen(false)}
                role={editRole}
            />
        </>
    );
};

export default RolesList;