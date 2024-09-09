import { getValueByPath, isDarkMode, makeRequestOne } from '@/config/config'
import { Box, Button, Card, em, Grid, Group, NavLink, NumberInput, Stack, Text, Textarea, TextInput, Title, Tooltip, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import { IconAlertCircle, IconAlertTriangle, IconLetterT } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { useDebouncedState } from '@mantine/hooks'
import { API_ENDPOINTS } from '@/config/constants'
import { useAppContext } from '@/providers/appProvider'
import { showNotification } from '@mantine/notifications'
import { extractNumbers } from '@/config/functions'

const topicInfo = {
    // id: null,
    period: 0,
    title: "",
    description: "",
    order: 0,
    notes: "",
    subtopics: []
}

interface ISingleTopicForm {
    form: any
    path: string
    topic: any
}

const SingleTopicForm = ({ form, path, topic }: ISingleTopicForm) => {
    const [loading, setLoading] = useState(false)
    const [topicContent, settopicContent] = useDebouncedState(getValueByPath(form.values, `${path}.notes`), 1000)
    const theme = useMantineTheme()
    const { token } = useAppContext()
    const { colorScheme } = useMantineColorScheme()

    const subtopics = getValueByPath(form.values, `${path}.subtopics`)

    const updateFormtopicContent = (new_val: any) => {
        settopicContent(new_val)
    }

    const depthSize = extractNumbers(path).length

    const addSubtopic = () => {
        // console.log(`${path}.subtopics`, "adding", )
        form.insertListItem(`${path}.subtopics`, topicInfo)
    }

    const deleteTopicFromBackend = () => {
        setLoading(true)
        makeRequestOne({
            url: `${API_ENDPOINTS.TOPICS}/${topic.id}`,
            method: 'DELETE',
            extra_headers: {
                AUTHORIZATION: `Bearer ${token}`
            }
        }).then(() => {
            deleteTopic()
        }).catch((err: any) => {
            console.log(err)
            showNotification({
                title: "Error deleting",
                message: "Error deleting topic",
                color: 'red',
                position: 'bottom-center',
                icon: <IconAlertTriangle size={'18px'} stroke={em(1.5)} />
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const deleteTopic = () => {
        let path_values = path.split('.')
        let index = path_values[path_values.length - 1];
        let real_path = path_values.slice(0, path_values.length - 1).join('.')
        form.removeListItem(real_path, parseInt(index))
    }

    const removeTopic = () => {
        if (topic?.id) {
            deleteTopicFromBackend()
        } else {
            deleteTopic()
        }
    }

    useEffect(() => {
        form.setFieldValue(`${path}.notes`, topicContent)
    }, [topicContent])


    return (
        <Card radius={'md'} p={'xs'} bg={isDarkMode(colorScheme) ? theme.colors.dark[8]:theme.colors.gray[0]}>
            <Stack gap={6}>
                <Group justify='space-between'>
                    <Title order={3} fw={500}>{topic?.title}</Title>
                    <Button color='red' variant='light' radius={'md'} size='xs' onClick={removeTopic} loading={loading}>Delete</Button>
                </Group>
                <Grid>
                    <Grid.Col span={{ md: 6 }}>
                        <TextInput label="Title" placeholder='Enter Topic Title' {...form.getInputProps(`${path}.title`)} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 6 }}>
                        <Grid>
                            <Grid.Col span={6}>
                                <NumberInput label="Period (Hours)" {...form.getInputProps(`${path}.period`)} />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput label={
                                    <Tooltip label="Order of appearance">
                                        <Group>
                                            <Text>Order</Text>
                                            <IconAlertCircle size={14} />
                                        </Group>
                                    </Tooltip>
                                } {...form.getInputProps(`${path}.order`)} />
                            </Grid.Col>
                        </Grid>
                    </Grid.Col>
                    <Grid.Col span={{ md: 12 }}>
                        <Textarea minRows={4} autosize label="Description" placeholder='Enter Topic Description' {...form.getInputProps(`${path}.description`)} />
                    </Grid.Col>
                    {/* <Grid.Col span={{ md: 12 }}>
                        <Title mb="md" order={3}>Topic Notes</Title>
                        <CustomRTE content={form.values.notes} updateForm={updateFormtopicContent} readonly={false} height='400px' />
                    </Grid.Col> */}
                    <Grid.Col span={{ md: 12 }}>
                        <Stack>
                            <>
                                <Group justify='space-between'>
                                    <Title order={3} fw={500}>Sub-topics</Title>
                                    <Button onClick={addSubtopic} size='sm' variant='light' radius={'md'} disabled={depthSize >= 3}>Add Sub-topic</Button>
                                </Group>

                                <Box p="xs" display={subtopics?.length > 0 ? 'block' : 'none'} style={{
                                    background: isDarkMode(colorScheme) ? theme.colors.dark[7] : theme.colors.gray[1],
                                    borderRadius: theme.radius.md
                                }}>
                                    <Stack gap={4}>
                                        {
                                            subtopics?.map((subtopic: any, i: any) => (
                                                <NavLink key={`topic_in_${path}.subtopics.${i}`} active
                                                    style={{ borderRadius: theme.radius.md }} leftSection={<IconLetterT />}
                                                    label={subtopic?.title === "" ? "New Subtopic" : subtopic?.title} variant='light'>
                                                    <SingleTopicForm form={form} path={`${path}.subtopics.${i}`} topic={subtopic} />
                                                </NavLink>
                                            ))
                                        }
                                    </Stack>
                                </Box>
                            </>
                            {
                                subtopics?.length > 3 ? (
                                    <Group justify='end'>
                                        <Button onClick={addSubtopic} size='sm' disabled={depthSize >= 3}>Add subtopic</Button>
                                    </Group>
                                ) : null
                            }
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Card>
    )
}

export default SingleTopicForm