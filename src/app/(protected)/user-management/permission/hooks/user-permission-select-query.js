import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export const userPermissionSelectQuery = () => {
    const fetchPermissionList = async () => {
        const response = await apiFetch('/api/user-management/permissions/select');

        if(!response.ok){
            toast.error(
                'Something went wrong while loading the record. Please try again.',
                {
                    position: 'top-center'
                },
            );
            throw new Error('Failed to fetch permissions');
        }

        const data = await response.json();
        // API mengembalikan array langsung, bukan object dengan property data
        return Array.isArray(data) ? data : data.data || [];
    };

    return useQuery({
        queryKey: ['user-permissions-select'],
        queryFn: fetchPermissionList,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
};