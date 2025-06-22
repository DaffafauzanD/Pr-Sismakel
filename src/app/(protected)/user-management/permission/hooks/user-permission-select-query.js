import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export const userPermissionSelectQuery = () => {
    const fethPermissionList = async () => {
        const response = await apiFetch('/api/user-management/permissions/select');

        if(!response){
            toast.error(
                'Something went wrong while loading the record. Please try again.',
                {
                    position: 'top-center'
                },
            );
        }

        return response.json();
    };

    return useQuery({
        queryKey: ['user-permissions-select'],
        queryFn: fethPermissionList,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
};