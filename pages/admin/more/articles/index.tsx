import CreateBlogForm from '@/components/forms/CreateBlogForm'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'
import { toDate } from '@/config/config'
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS, TABLE_ICON_SIZE } from '@/config/constants'
import AdminWrapper from '@/layouts/AdminWrapper'
import { Group, Image, Stack, Text, Title } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import React from 'react'

const Articles = () => {

    return (
        <div>
            <Stack>
                <Title>Articles</Title>
                <CustomDataTable
                    url={API_ENDPOINTS.BLOGS}
                    method={'GET'}
                    defaultFilters={{
                        page: 1,
                        limit: '10',
                        ordering: 'id',
                        search: "",
                        // fields: "id,name,description,created_at,modified_at"
                    }}
                    useNext={false}
                    formValidators={undefined}
                    hideUpdateActionBtn={false}
                    updateData={{
                        formNode: CreateBlogForm,
                        modalSize: '1000px',
                        updatingModalTitle: "Update Blog",
                        deletingModalTitle: "Delete Blog",
                    }}
                    columns={[
                        {
                            accessor: 'id',
                            title: 'ID',
                            width: '80px'
                        },
                        {
                            accessor: "image",
                            title: "Image",
                            width: "100px",
                            render: (item: any) => (
                                <Image maw={'100%'} src={item?.image} radius={'md'} />
                            )
                        },
                        {
                            accessor: "title",
                            title: "Title",
                            width: "200px",
                        },
                        {
                            accessor: "author.full_name",
                            title: "Author",
                            width: "200px",
                        },
                        {
                            accessor: "categories",
                            title: "Categories",
                            width: "200px",
                            render: (item: any) => (
                                <Group>
                                    <Text size='sm'>{item?.categories?.map((cat: any) => cat?.title).join(', ')}</Text>
                                </Group>
                            )
                        },
                        {
                            accessor: "is_newsletter",
                            title: "Newsletter",
                            textAlign: 'center',
                            width: "200px",
                            render: (item: any) => (
                                item?.is_newsletter ? <IconCheck color='green' size={TABLE_ICON_SIZE} /> : <IconX color='red' size={TABLE_ICON_SIZE} />
                            )
                        },
                        {
                            accessor: 'created_on',
                            title: 'Created On',
                            width: '250px',
                            render: (item: any) => (
                                <Text size='sm'>{toDate(item?.created_on, true)}</Text>
                            )
                        },
                        {
                            accessor: 'updated_on',
                            title: 'Modified On',
                            width: '250px',
                            render: (item: any) => (
                                <Text size='sm'>{toDate(item?.updated_on, true)}</Text>
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
                            placeholder: 'Search by title, description, content, keywords',
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
                                        { value: 'title', label: 'Title' },
                                    ]
                                },
                                {
                                    group: 'Descending',
                                    items: [
                                        { value: '-id', label: 'ID' },
                                        { value: '-title', label: 'Title' },
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

Articles.PageLayout = AdminWrapper

export default Articles
