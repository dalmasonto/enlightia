import CustomDataTable from "@/components/tables/filters/CustomDataTable"
import { toDate } from "@/config/config"
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from "@/config/constants"
import InstitutionWrapper from "@/layouts/InstitutionWrapper"
import { Stack, Title, Group, Avatar, Text, Button, Box, Modal, Drawer, ScrollArea } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import { useRouter } from "next/router"
import { useState } from "react"



const Students = () => {
    const { query } = useRouter()
    const [student, setStudent] = useState<any>(null)
    const [opened, { open, close }] = useDisclosure(false)

    const moreAboutStudent = (student: any) => {
        setStudent(student)
        open()
    }


    return (
        <div>
            <Stack>
                <Box>
                    <Title>Students</Title>
                    <Text size="sm">These are all the students who have enrolled to different courses that you are offering</Text>
                </Box>
                <CustomDataTable
                    url={API_ENDPOINTS.INSTITUTION_STUDENTS}
                    method={'GET'}
                    defaultFilters={{
                        page: 1,
                        limit: '10',
                        ordering: 'id',
                        search: "",
                        institution: query?.id,
                        fields: "student,user,full_name, profile, avatar, date_joined, last_login, is_active"
                    }}
                    useNext={false}
                    formValidators={undefined}
                    hideUpdateActionBtn={false}
                    hideDeleteActionBtn
                    hideActionsColumn={true}
                    updateData={{
                        formNode: undefined,
                        modalSize: 'lg',
                        updatingModalTitle: "Update",
                        deletingModalTitle: "Delete",
                        extraFormProps: {
                            is_admin: true
                        }
                    }}
                    columns={[
                        {
                            accessor: 'id',
                            title: '#',
                            width: '80px',
                            textAlign: 'center',
                            render: (item: any, i: number) => (
                                <>{i + 1}</>
                            )
                        },
                        {
                            accessor: "name",
                            title: "Name",
                            width: "300px",
                            render: (item: any) => (
                                <Group p={0} style={{
                                    cursor: "pointer"
                                }} wrap='nowrap' onClick={() => moreAboutStudent(item)}>
                                    <Avatar radius="md" src={item?.student?.user?.profile?.avatar} alt={item?.student?.user?.full_name} />
                                    <Stack gap={2}>
                                        <Text size="sm">{item?.student?.user?.full_name}</Text>
                                    </Stack>
                                </Group>
                            )
                        },
                        {
                            accessor: 'is_active',
                            title: 'Is Active',
                            width: '180px',
                            render: (item: any) => (
                                <Button size="xs" w={'80px'} variant="light" radius={'xl'} color={item?.student?.user?.is_active ? 'green' : 'yellow'}>{item?.student?.user?.is_active ? 'Yes' : 'No'}</Button>
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
                <Drawer title={"Quick Student Information"}
                    opened={opened} onClose={close}
                    position="right"
                    scrollAreaComponent={ScrollArea.Autosize}
                    size={'xl'}
                    // offset={8}
                    radius={'30px 0 0 30px'}
                >
                    <Box h={'10000px'} />
                </Drawer>
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
