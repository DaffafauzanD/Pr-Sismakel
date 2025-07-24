'use client'

import { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronRight, Ellipsis, Plus, Search, X } from 'lucide-react';
import { formatDateTime } from '@/lib/helpers';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTable } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Data dummy
const dummyRoles = [
    {
        id: 1,
        name: 'Admin',
        RolePermission: [
            { Permission: { name: 'Create User' } },
            { Permission: { name: 'Edit User' } },
            { Permission: { name: 'Delete User' } },
            { Permission: { name: 'View Reports' } },
            { Permission: { name: 'Manage Settings' } }
        ],
        created_at: '2024-01-15T08:30:00Z',
        created_by: 'System',
        updated_at: '2024-01-20T10:15:00Z',
        updated_by: 'John Doe'
    },
    {
        id: 2,
        name: 'Manager',
        RolePermission: [
            { Permission: { name: 'View User' } },
            { Permission: { name: 'Edit User' } },
            { Permission: { name: 'View Reports' } }
        ],
        created_at: '2024-01-16T09:20:00Z',
        created_by: 'Admin',
        updated_at: '2024-01-22T14:30:00Z',
        updated_by: 'Jane Smith'
    },
    {
        id: 3,
        name: 'Editor',
        RolePermission: [
            { Permission: { name: 'Edit Content' } },
            { Permission: { name: 'Publish Content' } }
        ],
        created_at: '2024-01-17T11:45:00Z',
        created_by: 'Manager',
        updated_at: '2024-01-25T16:20:00Z',
        updated_by: 'Bob Wilson'
    },
    {
        id: 4,
        name: 'Viewer',
        RolePermission: [
            { Permission: { name: 'View Content' } }
        ],
        created_at: '2024-01-18T13:10:00Z',
        created_by: 'Admin',
        updated_at: '2024-01-26T18:45:00Z',
        updated_by: null
    },
    {
        id: 5,
        name: 'Moderator',
        RolePermission: [
            { Permission: { name: 'Moderate Comments' } },
            { Permission: { name: 'Ban Users' } },
            { Permission: { name: 'Delete Posts' } },
            { Permission: { name: 'Review Reports' } }
        ],
        created_at: '2024-01-19T15:30:00Z',
        created_by: 'Admin',
        updated_at: '2024-01-27T12:15:00Z',
        updated_by: 'Alice Johnson'
    }
];

const RolesListStatic = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState([{id: 'created_at', desc: true}]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);

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
                    headerTitle: 'Role'
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
                    headerTitle: 'Permission'
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
                    headerTitle: 'Create Date'
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
                    headerTitle: 'Create By'
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
                    headerTitle: 'Update Date'
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
                    headerTitle: 'Update By'
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
                                console.log('Edit role:', row.original);
                            }}>
                                Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={() => {
                                console.log('Delete role:', row.original);
                            }}>
                                Delete Role
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
                size: 75,
                enableSorting: false,
                enableResizing: false
            }
        ],
        [],
    );

    const table = useReactTable({
        columns,
        data: dummyRoles,
        pageCount: Math.ceil(dummyRoles.length / pagination.pageSize),
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
        manualPagination: false,
        manualSorting: false,
        manualFiltering: false,
    });

    const DataGridToolbar = () => {
        const [inputValue, setInputValue] = useState(searchQuery);

        const handleSearch = () => {
            setSearchQuery(inputValue);
            setPagination({...pagination, pageIndex: 0});
        };

        return (
            <CardHeader className='py-5'>
                <div className='flex items-center gap-2.5'>
                    <div className='relative'> 
                        <Search className='size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2'/>
                        <Input 
                            placeholder='Search roles' 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className='ps-9 w-full md:w-64'
                        />

                        {searchQuery.length > 0 && (
                            <Button 
                                mode='icon' 
                                variant='dim' 
                                className='absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6'
                                onClick={() => {
                                    setSearchQuery('');
                                    setInputValue('');
                                }}
                            >
                                <X/>
                            </Button>
                        )}
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <Button onClick={() => {
                        console.log('Add new role');
                        setEditDialogOpen(true);
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
                recordCount={dummyRoles.length}
                isLoading={false}
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

            {/* Dialog placeholder - bisa ditambahkan nanti */}
            {editDialogOpen && (
                <div>
                    {/* Edit dialog content */}
                    <button onClick={() => setEditDialogOpen(false)}>Close</button>
                </div>
            )}
        </>
    );
};

export default RolesListStatic;
