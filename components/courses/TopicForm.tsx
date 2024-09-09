import { RequestProps, isDarkMode, makeRequestOne } from '@/config/config'
import { displayErrors, getTheme } from '@/config/functions'
import { useAppContext } from '@/providers/appProvider'
import { Box, Button, Card, Grid, Group, NavLink, NumberInput, Select, Stack, Text, TextInput, Textarea, Title, Tooltip, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconAlertCircle, IconAlertTriangle, IconLetterT } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { TopicFormFields } from './AddCourseForm'
import { API_ENDPOINTS } from '@/config/constants'
import { useDebouncedState } from '@mantine/hooks'
import CustomRTE from '../forms/customRTE/CustomRTE'

interface ITopicForm {
    updating: boolean
    data?: any
    topics: any
}
const TopicForm = (props: ITopicForm) => {
    const { updating, data, topics } = props
    const [loading, setLoading] = useState(false)
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()
    const [topicContent, settopicContent] = useDebouncedState(data?.notes, 1000)

    const { token, user_id } = useAppContext()
    const { query, reload } = useRouter()

    const form = useForm({
        initialValues: {
            created_by: user_id,
            period: updating ? data?.period : 0,
            title: updating ? data?.title : "",
            description: updating ? data?.description : "",
            order: updating ? data?.order : 0,
            parent: updating ? data?.parent?.toString() : "",
            notes: updating ? data?.notes : "",
            subtopics: []
        }
    })

    const handleSubmit = () => {
        let data: any = structuredClone(form.values)
        if (updating) {
            delete data.subtopics
        }
        let requestOptions: RequestProps = {
            url: API_ENDPOINTS.TOPICS,
            method: 'POST',
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            data: {
                ...data,
                course: query.cid
            },
            params: {},
            useNext: false
        }

        if (updating) {
            requestOptions.url = `${API_ENDPOINTS.TOPICS}/${query.tid}`
            requestOptions.method = 'PUT'
        }
        setLoading(true)
        makeRequestOne(requestOptions).then(res => {
            let msg = updating ? 'You have successfully updated the topic' : 'You have successfully create a new topic.'
            showNotification({
                title: 'Success',
                message: msg,
                color: 'green',
                icon: <IconAlertCircle stroke={1.5} />,
            })
            form.reset()
            reload()
        }).catch(error => {
            const errors = error?.response?.data
            displayErrors(form, errors)
            showNotification({
                title: 'Error',
                message: "Something went wrong!",
                color: 'red',
                icon: <IconAlertTriangle stroke={1.5} />,
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const addTopic = (parentIndex?: any) => {
        const topic = {
            created_by: user_id,
            course: query.cid,
            period: 0,
            title: "",
            description: "",
            order: 0,
            subtopics: []
        }
        if (parentIndex !== null) {
            form.insertListItem(`subtopics.${`${parentIndex}`}.subtopics`, topic)
            // return
        }
        else {
            form.insertListItem('subtopics', topic)
        }
    }

    const buttonLabel = updating ? "Update Topic" : "Add Topic"

    const updateFormtopicContent = (new_val: any) => {
        settopicContent(new_val)
    }

    useEffect(() => {
        form.setFieldValue('notes', topicContent)
    }, [topicContent])

    return (
        <>
            <Card radius={'md'}>
                <Group mb="sm" align='center' justify='apart'>
                    <Text>{form.values.title}</Text>
                </Group>
                <form onSubmit={form.onSubmit((values) => handleSubmit())}>
                    <Stack gap={30}>
                        <Grid>
                            <Grid.Col span={{ md: 6 }}>
                                <TextInput label="Title" placeholder='Enter Topic Title' {...form.getInputProps(`title`)} />
                            </Grid.Col>
                            <Grid.Col span={{ md: 6 }}>
                                <Grid>
                                    <Grid.Col span={6}>
                                        <NumberInput label="Period (Hours)" {...form.getInputProps(`period`)} />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <NumberInput label={
                                            <Tooltip label="Order of appearance">
                                                <Group>
                                                    <Text>Order</Text>
                                                    <IconAlertCircle size={14} />
                                                </Group>
                                            </Tooltip>
                                        } {...form.getInputProps(`order`)} />
                                    </Grid.Col>
                                </Grid>
                            </Grid.Col>
                            <Grid.Col span={{ md: 12 }}>
                                <Textarea minRows={4} autosize label="Description" placeholder='Enter Topic Description' {...form.getInputProps(`description`)} />
                            </Grid.Col>
                            <Grid.Col span={{ md: 12 }}>
                                <Select label="Parent Topic"
                                    {...form.getInputProps(`parent`)}
                                    placeholder='Select parent topic or leave blank'
                                    searchable
                                    clearable
                                    data={[
                                        ...topics?.map((topic: any, i: number) => ({
                                            value: topic.id.toString(),
                                            label: topic.title
                                        }))
                                    ]} nothingFoundMessage="No other topics" />
                            </Grid.Col>
                            <Grid.Col span={{ md: 12 }}>
                                <Title mb="md" order={3}>Topic Notes</Title>
                                <CustomRTE content={form.values.notes} updateForm={updateFormtopicContent} readonly={false} height='400px' />
                            </Grid.Col>
                            <Grid.Col span={{ md: 12 }}>
                                <Stack>
                                    {
                                        !updating ? (
                                            <>
                                                <Group justify='space-between'>
                                                    <Title order={3} fw={500}>Sub-topics</Title>
                                                    <Button onClick={() => addTopic(null)} size='sm' variant='light' radius={'md'}>Add Sub-topic</Button>
                                                </Group>

                                                <Box p="lg" display={form.values.subtopics.length > 0 ? 'block' : 'none'} style={{
                                                    background: isDarkMode(colorScheme) ? theme.colors.dark[7] : theme.colors.gray[1],
                                                    borderRadius: theme.radius.md
                                                }}>
                                                    <Stack gap={4}>
                                                        {
                                                            form.values.subtopics.map((topic: any, i: any) => (
                                                                <NavLink key={`topic_in${topic.id}`} active
                                                                    style={{ borderRadius: theme.radius.md }} leftSection={<IconLetterT />}
                                                                    label={topic?.title === "" ? "New Subtopic" : topic?.title} variant='light'>
                                                                    <TopicFormFields form={form} addTopic={addTopic} index={i} parentIndex={null} formkey={'subtopics'} />
                                                                </NavLink>
                                                            ))
                                                        }
                                                    </Stack>
                                                </Box>
                                            </>
                                        ) : null
                                    }
                                    {
                                        !updating ? form.values.subtopics?.length > 3 ? (
                                            <Group justify='apart'>
                                                <Title order={3} fw={400}>SubTopics</Title>
                                                <Button onClick={() => addTopic(null)} size='sm'>Add subtopic</Button>
                                            </Group>
                                        ) : null : null
                                    }
                                </Stack>
                            </Grid.Col>
                        </Grid>
                        <Box>
                            <Button type='submit'>
                                {buttonLabel}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Card>
        </>
    )
}

export default TopicForm