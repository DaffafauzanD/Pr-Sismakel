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
  import RolesListStatic from './components/role-list-static';

  export const metaData = {
    title: 'Roles',
    description: 'Manage user roles.'
  }

  export default async function Page() {
    return (
        <>
            <Container>
                <Toolbar>
                    <ToolbarHeading>
                        <ToolbarTitle>Roles</ToolbarTitle>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href='/'>Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Roles Management</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </ToolbarHeading>
                    <ToolbarActions></ToolbarActions>
                </Toolbar>
            </Container>
            <Container>
                <RolesListStatic/>
            </Container>
        </>
    )
  }