'use-client'

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
import { Card, CardFooter, CardHeader, CardTable } from '@/components/ui/card';
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

const rolePermissionsList = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState([{ id: 'create_date', desc: true}]);
    const [rowSelection, setRowSelection] = useState({});

    const [selectedRole, setSelectedRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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

        if(!response){
            throw new Error(
                'Oops! Something didn’t go as planned. Please try again in a moment',
            );
        }
        
        const result = await response.json()
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
        ]
    )
    
}