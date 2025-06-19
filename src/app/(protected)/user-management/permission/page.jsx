import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb';
  import { Container } from '@/components/common/container';
  import { 
    Toolbar,
    ToolbarActions,
    ToolbarHeading,
    ToolbarTitle,
} from '@/components/common/toolbar';
import RolePermissionsList from './components/rolePermissions-list';

export const metadata = {
    tilte: 'Permissions',
    description: 'Manage user permissions.'
};

export default async function Page() {
    return(
        <>
            <Container>
                <Toolbar>
                    <ToolbarHeading>
                        <ToolbarTitle>Permissionns</ToolbarTitle>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href='/'>Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Page</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </ToolbarHeading>
                    <ToolbarActions></ToolbarActions>
                </Toolbar>
            </Container>
            <Container>
                <RolePermissionsList/>
            </Container>
        </>
    );
}