import CreateEnrollment from "@/components/forms/more_forms/CreateEnrollment"
import CustomDataTable from "@/components/tables/filters/CustomDataTable"
import { toDate } from "@/config/config"
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from "@/config/constants"
import InstitutionWrapper from "@/layouts/InstitutionWrapper"
import { Stack, Title, Group, Avatar, Text, Button } from "@mantine/core"
import { useRouter } from "next/router"

const Students = () => {
    const { query } = useRouter()
    return (
        <div>
            <Stack>
                <Title>Enrolled Students</Title>
                <CustomDataTable
                    url={API_ENDPOINTS.ENROLLMENTS}
                    method={'GET'}
                    defaultFilters={{
                        page: 1,
                        limit: '10',
                        ordering: 'id',
                        search: "",
                        course: query?.cid,
                        course__institution: query?.id
                        // fields: "id,name,description,created_at,modified_at"
                    }}
                    useNext={false}
                    formValidators={undefined}
                    hideUpdateActionBtn={false}
                    hideDeleteActionBtn
                    updateData={{
                        formNode: CreateEnrollment,
                        modalSize: 'lg',
                        updatingModalTitle: "Update Enrollment",
                        deletingModalTitle: "Delete Enrollment",
                        extraFormProps: {
                            is_admin: true
                        }
                    }}
                    columns={[
                        {
                            accessor: 'id',
                            title: 'ID',
                            width: '80px'
                        },
                        {
                            accessor: "name",
                            title: "Name",
                            width: "300px",
                            render: (item: any) => (
                                <Group p={0} style={{
                                    cursor: "pointer"
                                }} wrap='nowrap'>
                                    <Avatar radius="md" src={item?.student?.user?.profile?.avatar} alt={item?.student?.user?.full_name} />
                                    <Stack gap={2}>
                                        <Text size="sm">{item?.student?.user?.full_name}</Text>
                                        <Text size="xs" c={'dimmed'}>{item?.student?.user?.email}</Text>
                                        <Text size="sm">{item?.student?.user?.username}</Text>
                                    </Stack>
                                </Group>
                            )
                        },
                        {
                            accessor: 'student.user.profile.phone_number',
                            title: 'Phone Number',
                            width: '180px',
                        },
                        {
                            accessor: 'is_active',
                            title: 'Is Active',
                            width: '180px',
                            render: (item: any) => (
                                <Button size="xs" w={'80px'} variant="light" radius={'xl'} color={item?.is_active ? 'green' : 'yellow'}>{item?.is_active ? 'Yes' : 'No'}</Button>
                            )
                        },
                        {
                            accessor: 'date_joined',
                            title: 'Registered On',
                            width: '250px',
                            render: (item: any) => (
                                <Text size='sm'>{toDate(item?.student?.user?.date_joined, true)}</Text>
                            )
                        },
                        {
                            accessor: 'last_login',
                            title: 'Last Login',
                            width: '250px',
                            render: (item: any) => (
                                <Text size='sm'>{toDate(item?.student?.user?.last_login, true)}</Text>
                            )
                        }
                    ]}
                    filterFields={[
                        {
                            accessor: 'limit',
                            label: 'Limit',
                            gridSize: 2,
                            placeholder: '23',
                            type: 'select',
                            options: [
                                { value: '2', label: '2' },
                                { value: '5', label: '5' },
                                { value: '10', label: '10' },
                                { value: '15', label: '15' },
                                { value: '20', label: '20' },
                                { value: '50', label: '50' },
                                { value: '100', label: '100' },
                            ]
                        },
                        {
                            accessor: 'search',
                            label: 'Search',
                            gridSize: 2,
                            placeholder: 'Search by name, email, username, phone number',
                            type: 'text'
                        },
                        {
                            accessor: 'ordering',
                            label: 'Ordering',
                            gridSize: 2,
                            placeholder: '23',
                            type: 'select',
                            options: [
                                {
                                    group: 'Ascending',
                                    items: [
                                        { value: 'id', label: 'ID' },
                                        { value: 'first_name', label: 'First NameName' },
                                    ]
                                },
                                {
                                    group: 'Descending',
                                    items: [
                                        { value: '-id', label: 'ID' },
                                        { value: '-first_name', label: 'First Name' },
                                    ]
                                }
                            ]
                        },
                    ]}
                />
            </Stack>
        </div>
    )
}

export async function getServerSideProps(context: any) {
    const cookies = context.req.cookies
    const userDetails_: any = cookies[LOCAL_STORAGE_KEYS.user]

    const token = cookies[LOCAL_STORAGE_KEYS.token]

    const userDetails: any = JSON.parse(userDetails_ ?? "{}")

    return {
        props: {

        }
    }
}

Students.PageLayout = InstitutionWrapper

export default Students
