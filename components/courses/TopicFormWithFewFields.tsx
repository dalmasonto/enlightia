import { useMantineTheme, NavLink, Group, Grid, NumberInput, Stack, TextInput, Tooltip, Text, Button, LoadingOverlay, Center, Paper, Title, Card, useMantineColorScheme, Box } from "@mantine/core"
import { useState } from "react"
import { API_ENDPOINTS, EMOJIS } from "../../config/constants"
import { RequestProps, isDarkMode, makeRequestOne } from "../../config/config"
import { useAppContext } from "../../providers/appProvider"
import { showNotification } from "@mantine/notifications"
import { displayErrors } from "../../config/functions"
import { useForm } from "@mantine/form"
import { IconAlertCircle, IconAlertTriangle } from "@tabler/icons-react"


interface ITopicFormWithFewFields {
    topic: any
}

const TopicFormWithFewFields = ({ topic }: ITopicFormWithFewFields) => {
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const form = useForm({
        initialValues: {
            title: topic?.title,
            period: topic?.period,
            order: topic?.order
        },
        validate: {
            title: value => value === "" ? "Title is required" : null,
            period: value => value === "" ? "Period is required" : null,
            order: value => value === "" ? "Order is required" : null,
        }
    })

    const handleSubmit = () => {
        let data: any = structuredClone(form.values)
        let requestOptions: RequestProps = {
            url: `${API_ENDPOINTS.TOPICS}/${topic.id}/?fields=title,period,order`,
            method: 'PUT',
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            data: {
                ...data
            },
            params: {},
            useNext: false
        }
        setLoading(true)
        makeRequestOne(requestOptions).then(res => {
            showNotification({
                title: `Success ${EMOJIS.smiley}`,
                message: "Topic updated successfully",
                color: 'green',
                icon: <IconAlertCircle stroke={1.5} />,
            })
            // form.reset()
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

    return (
        <Paper p="xs" radius={'md'} style={{
            position: "relative"
        }}>
            <LoadingOverlay visible={loading} />
            <form onSubmit={form.onSubmit((values) => handleSubmit())}>
                <Stack gap={30}>
                    <Grid>
                        <Grid.Col span={{ md: 5 }}>
                            <TextInput radius={'md'} label="Title" placeholder='Enter Topic Title' {...form.getInputProps(`title`)} />
                        </Grid.Col>
                        <Grid.Col span={{ md: 5 }}>
                            <Grid>
                                <Grid.Col span={8}>
                                    <NumberInput radius={'md'} label="Period (Hours)" {...form.getInputProps(`period`)} />
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <NumberInput radius={'md'} label={
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
                        <Grid.Col span={{ md: 2 }}>
                            <Group className="h-100" align="end" >
                                <Box>
                                    <Button type='submit' size="xs" radius="md" variant="light">
                                        Update
                                    </Button>
                                </Box>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </form>
        </Paper>
    )
}


interface TopicForSidebarProps {
    topic: any,
    courseID: any,
    courseSLUG: any,
}


const UpdateTopicWithFewFieldsForm = (props: TopicForSidebarProps) => {
    const { topic, courseID, courseSLUG } = props
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()
    const topicURL = `/courses/${courseID}/${courseSLUG}/topics/${topic?.id}/${topic?.slug}/`

    return (
        <Card p={'xs'} radius={'md'}>
            {
                topic?.subtopics?.length === 0 ? (
                    <TopicFormWithFewFields topic={topic} />
                ) : (
                    <NavLink
                        label={`${topic?.title} (${topic?.subtopics?.length} Subtopics)`}
                        fw={500}
                        defaultOpened
                        style={{
                            borderRadius: theme.radius.md
                        }}>
                        <Stack gap={4} bg={isDarkMode(colorScheme) ? theme.colors.dark[7] : theme.colors.gray[1]} p={'xs'} style={{ radius: theme.radius.md }}>
                            <TopicFormWithFewFields topic={topic} />
                            <Title order={5} fw={500}>Subtopics</Title>
                            {
                                topic?.subtopics?.map((subtopic: any, i: any) => (
                                    <UpdateTopicWithFewFieldsForm key={`topic_subtopic${subtopic.id}`} topic={subtopic}
                                        courseID={courseID}
                                        courseSLUG={courseSLUG} />
                                ))
                            }
                        </Stack>
                    </NavLink>

                )
            }
        </Card>
    )
}

export default UpdateTopicWithFewFieldsForm