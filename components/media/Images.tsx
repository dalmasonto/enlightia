import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { isDarkMode, makeRequestOne } from '../../config/config'
import { API_ENDPOINTS, EMOJIS } from '../../config/constants'
import { Stack, Grid, Box, Pagination, LoadingOverlay, Tabs, Title, SegmentedControl, Select, Alert, Button, CopyButton, Drawer, Group, TextInput, useMantineTheme, useMantineColorScheme } from '@mantine/core'
import FileBox, { renderItem } from './FileBox'
import UploadMedia from './UploadMedia'
import { IconAlertCircle, IconAlertTriangle, IconCheck, IconCopy, IconTrash, IconWriting } from '@tabler/icons-react'
import { useAppContext } from '@/providers/appProvider'
import { useRouter } from 'next/router'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'

interface IFilesComponent {
    files: any
    handleDelete: any
    handleUpdate: any
}

const UpdateFileForm = ({ file, handleUpdate }: { file: any, handleUpdate: any }) => {

    const form = useForm({
        initialValues: {
            title: file?.title,
            description: file?.title,
        },
        validate: {
            title: value => value.length > 5 ? null : "Title must be at least 5 characters long",
        }

    })

    return (
        <form onSubmit={form.onSubmit((values) => handleUpdate(file?.id, values))}>
            <Stack>
                <TextInput label="File Title/Alt" radius="sm" {...form.getInputProps('title')} />
                <Group justify='right'>
                    <Button leftSection={<IconWriting color='white' stroke={1.5} />} type="submit" >Update</Button>
                </Group>
            </Stack>
        </form>
    )
}

const FilesComponent = ({ files, handleDelete, handleUpdate }: IFilesComponent) => {
    const [file, setFile] = useState<any>(null)
    const [opened, { open, close }] = useDisclosure(false)

    const { colorScheme } = useMantineColorScheme()
    const theme = useMantineTheme()


    const openDrawer = (item: any) => {
        setFile(item)
        open()
    }

    return (
        <>
            {
                files?.length === 0 ? (
                    <Alert radius={'lg'} color='yellow'>
                        <Title order={3} fw={500} ta='center'>No Media Found</Title>
                    </Alert>
                ) : null
            }
            <Grid>
                {
                    files?.map((item: any, i: any) => (
                        <Grid.Col key={`image_${i}_${item?.id}`} span={{ md: 2 }} style={{ position: "relative" }}>
                            <FileBox item={item} openDrawer={openDrawer} />
                        </Grid.Col>
                    ))
                }
            </Grid>
            <Drawer title={file?.title} size={'lg'} zIndex={202} opened={opened} onClose={close} radius={"0 30px 30px 0"}>
                <Stack>
                    <Box p={"xs"} style={{
                        background: isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[1],
                        overflow: "hidden",
                        borderRadius: theme.radius.md,
                        cursor: "pointer",
                    }} >
                        {renderItem(file)}
                    </Box>
                    <UpdateFileForm file={file} handleUpdate={handleUpdate} />
                    <Group justify="center">
                        <CopyButton value={file?.file}>
                            {({ copied, copy }) => (
                                <Button radius={"md"} color={copied ? "green" : "blue"} onClick={copy} leftSection={copied ? <IconCheck /> : <IconCopy />}>
                                    {copied ? 'Copied' : 'Copy File URL'}
                                </Button>
                            )}
                        </CopyButton>
                        <CopyButton value={file?.title}>
                            {({ copied, copy }) => (
                                <Button radius={"md"} color={copied ? "green" : "blue"} onClick={copy} leftSection={copied ? <IconCheck /> : <IconCopy />}>
                                    {copied ? 'Copied' : 'Copy File Title'}
                                </Button>
                            )}
                        </CopyButton>
                        <Button radius={"md"} color={"red"} onClick={() => {
                            handleDelete(file?.id)
                            close()
                        }} leftSection={<IconTrash />}>
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Drawer>
        </>
    )
}

const initialFilterState = {
    search: "",
    ordering: "id",
    type: "all",
    page: 1,
    limit: '10',
}

interface ImagesProps {
    padding?: string,
    radius?: string,
}

const Images = (props: ImagesProps) => {

    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const { query } = useRouter()

    const extraParams: any = {}
    let MEDIA_ENDPOINT = `${API_ENDPOINTS.MEDIA}`

    if (query?.id) {
        extraParams.institution = query?.id
        MEDIA_ENDPOINT = API_ENDPOINTS.INSTITUTION_MEDIA
    }

    const filterForm = useForm({
        initialValues: initialFilterState
    })

    const myFilters = filterForm.values
    const { data, error, isValidating, mutate, isLoading } = useSWR({ url: MEDIA_ENDPOINT, method: "GET", extra_headers: {}, data: {}, params: { ...myFilters, ...extraParams, type: myFilters?.type === 'all' ? '' : myFilters.type } }, makeRequestOne)

    const files = data?.data?.results
    const count = data?.data?.count
    const pages = data?.data?.total_pages


    const handleDelete = (id: number) => {
        makeRequestOne({
            url: MEDIA_ENDPOINT + "/" + id, method: 'DELETE', useNext: false, extra_headers: {
                AUTHORIZATION: `Bearer ${token}`
            }
        }).then((res: any) => {
            mutate()
            showNotification({
                title: `Deleted ${EMOJIS['partypopper']} ${EMOJIS['partypopper']}`,
                message: "Your image has been deleted successfully",
                color: 'green',
                icon: <IconAlertCircle stroke={1.5} />,
            })
        }).catch((error) => {
            showNotification({
                title: 'Error',
                message: error?.response?.message,
                color: 'red',
                icon: <IconAlertTriangle stroke={1.5} />,
            })
        })
    }

    const handleUpdate = (id: any, obj: any) => {
        const data = obj
        const method = 'PUT'
        const url = MEDIA_ENDPOINT + "/" + id
        const success_msg = `Your media file has been updated successfully ${EMOJIS['partypopper']} ${EMOJIS['partypopper']}`

        makeRequestOne({
            url, method, extra_headers: {
                'Content-Type': 'application/json',
                AUTHORIZATION: `Bearer ${token}`
            }, data
        }).then((res: any) => {
            showNotification({
                title: `Congratulations ${EMOJIS['partypopper']} ${EMOJIS['partypopper']}`,
                message: success_msg,
                color: 'green',
                icon: <IconAlertCircle stroke={1.5} />,
            })
            mutate()
        }).catch((error) => {
            const errors = error.response?.data
            showNotification({
                title: 'Error',
                message: error?.message,
                color: 'red',
                icon: <IconAlertTriangle stroke={1.5} />,
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        filterForm.setFieldValue('page', 1)
    }, [filterForm.values.type, filterForm.values.limit])

    return (
        <>
            <Stack>
                <Box>
                    <Stack>
                        <Title>All Media Assets</Title>
                        <Grid>
                            <Grid.Col span={{ md: 12 }}>
                                <UploadMedia mutate={mutate} />
                            </Grid.Col>
                        </Grid>
                        <Grid>
                            <Grid.Col span={{ md: 2 }}>
                                <Select size='sm' radius="lg" {...filterForm.getInputProps('limit')}
                                    data={[
                                        { value: '5', label: '5' },
                                        { value: '10', label: '10' },
                                        { value: '20', label: '20' },
                                        { value: '30', label: '30' },
                                        { value: '40', label: '40' },
                                    ]} />
                            </Grid.Col>
                            <Grid.Col span={{ md: 10 }}>
                                <SegmentedControl size='sm' radius="lg" className='w-100' {...filterForm.getInputProps('type')}
                                    data={[
                                        {
                                            label: "All",
                                            value: "all",
                                        },
                                        {
                                            label: "Photos",
                                            value: "image",
                                        },
                                        {
                                            label: "PDFs/Documents",
                                            value: "document",
                                        },
                                        {
                                            label: "Videos",
                                            value: "video",
                                        },
                                        {
                                            label: "Audio",
                                            value: "audio",
                                        },
                                        {
                                            label: "UnClassified",
                                            value: "unknown",
                                        },
                                    ]}
                                />
                            </Grid.Col>
                        </Grid>
                        <Box style={{ position: "relative" }}>
                            <LoadingOverlay visible={isLoading} overlayProps={{ blur: 10 }} />
                            <Tabs value={filterForm.values.type} mih={200}>
                                <Tabs.Panel value="all" pt="xs">
                                    <FilesComponent files={files} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                </Tabs.Panel>
                                <Tabs.Panel value="image" pt="xs">
                                    <FilesComponent files={files} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                </Tabs.Panel>

                                <Tabs.Panel value="document" pt="xs">
                                    <FilesComponent files={files} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                </Tabs.Panel>
                                <Tabs.Panel value="video" pt="xs">
                                    <FilesComponent files={files} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                </Tabs.Panel>
                                <Tabs.Panel value="audio" pt="xs">
                                    <FilesComponent files={files} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                </Tabs.Panel>
                                <Tabs.Panel value="unknown" pt="xs">
                                    <FilesComponent files={files} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                                </Tabs.Panel>
                            </Tabs>
                        </Box>
                        <Box pt={"lg"}>
                            <Pagination radius={'md'} {...filterForm.getInputProps('page')} total={pages} />
                        </Box>
                    </Stack>
                </Box>
            </Stack >
        </>
    )
}

export default Images
