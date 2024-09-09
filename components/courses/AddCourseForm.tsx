import { Box, Button, Card, Grid, Group, LoadingOverlay, NumberInput, Stack, Text, TextInput, Textarea, Title, Tooltip } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { RequestProps, makeRequestOne } from '../../config/config'
import { showNotification } from '@mantine/notifications'
import { displayErrors } from '../../config/functions'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/router'
import { useAppContext } from '../../providers/appProvider'
import { IconAlertCircle, IconAlertTriangle } from '@tabler/icons-react'
import { API_ENDPOINTS } from '@/config/constants'
import CustomRTE from '../forms/customRTE/CustomRTE'
import { useDebouncedState } from '@mantine/hooks'
import SingleTopicForm from './SingleTopicForm'

interface ITopicFormFields {
    form: any
    addTopic?: any
    index: any
    parentIndex: any
    formkey: any
}

export const TopicFormFields = (props: ITopicFormFields) => {
    const { form, addTopic, index, parentIndex, formkey } = props
    let joinedIndexes = index
    let joiner = `.${index}`
    if (parentIndex) {
        joiner = `.${parentIndex}.${index}`
        joinedIndexes = `${parentIndex}.${index}`
    }

    const removeTopic = (index: number) => {
        form.removeListItem(formkey, index)
    }

    return (
        <>
            <Card radius={'md'}>
                <Group mb="sm" align='center' justify='space-between'>
                    <Text>{form.values[`${formkey}`][`${joinedIndexes}`].title}</Text>
                    <Tooltip color='red' label="Delete topic">
                        <Button color='red' radius={'md'} variant='light' size='sm' onClick={() => removeTopic(index)}>Delete</Button>
                    </Tooltip>
                </Group>
                <Grid>
                    <Grid.Col span={{ md: 6 }}>
                        <TextInput radius={'md'} size='sm' label="Title" placeholder='Enter Topic Title' {...form.getInputProps(`${formkey}${joiner}.title`)} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 6 }}>
                        <Grid>
                            <Grid.Col span={6}>
                                <NumberInput radius={'md'} size='sm' label="Period (Hours)" {...form.getInputProps(`${formkey}${joiner}.period`)} />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput radius={'md'} size='sm' label={
                                    <Tooltip label="Order of appearance">
                                        <Group>
                                            <Text>Order</Text>
                                            <IconAlertCircle size={14} />
                                        </Group>
                                    </Tooltip>
                                } {...form.getInputProps(`${formkey}${joiner}.order`)} />
                            </Grid.Col>
                        </Grid>
                    </Grid.Col>
                    <Grid.Col span={{ md: 12 }}>
                        <Textarea radius={'md'} size='sm' minRows={4} autosize label="Description" placeholder='Enter Topic Description' {...form.getInputProps(`${formkey}${joiner}.description`)} />
                    </Grid.Col>
                </Grid>
            </Card>
        </>
    )
}

interface IAddCourseForm {
    updating?: boolean,
    data?: any
}

const AddCourseForm = (props: IAddCourseForm) => {
    const { updating, data } = props
    const { user_id, token } = useAppContext()
    const { query, reload } = useRouter()
    const [CourseContent, setCourseContent] = useDebouncedState(data?.notes ?? "", 1000)

    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            title: updating ? data?.title : "",
            description: updating ? data?.description : "",
            banner: updating ? data?.banner : "",
            topics: [],
            notes: updating ? data?.notes : "",
        },
    })

    const handleSubmit = () => {
        let data: any = structuredClone(form.values)
        if (updating) {
            delete data.topics
        }
        let requestOptions: RequestProps = {
            url: API_ENDPOINTS.COURSE_CREATE_UPDATE,
            method: 'POST',
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            data: {
                institution: query?.id,
                created_by: user_id,
                notes: data.data,
                ...data
            },
            params: {},
            useNext: false
        }

        if (updating) {
            requestOptions.url = `${API_ENDPOINTS.COURSES}/${query.cid}`
            requestOptions.method = 'PUT'
        }
        setLoading(true)
        makeRequestOne(requestOptions).then(res => {
            let msg = updating ? 'You have successfully updated the course' : 'You have successfully create a new course.'
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

    const buttonLabel = updating ? "Update Course" : "Add Course"

    const addTopic = (parentIndex?: any) => {
        const topic = {
            created_by: user_id,
            period: 0,
            title: "",
            description: "",
            order: 0,
            subtopics: []
        }
        if (parentIndex !== null) {
            form.insertListItem(`topics.${`${parentIndex}`}.subtopics`, topic)
        }
        else {
            form.insertListItem('topics', topic)
        }

    }

    const updateFormCourseContent = (new_val: any) => {
        setCourseContent(new_val)
    }

    useEffect(() => {
        form.setFieldValue('notes', CourseContent)
    }, [CourseContent])

    return (
        <Card>
            <Grid>
                <Grid.Col span={{ md: 12 }} style={{ position: "relative" }}>
                    <LoadingOverlay visible={loading} />
                    <form onSubmit={form.onSubmit((values) => handleSubmit())}>
                        <Stack>
                            <TextInput size='sm' radius={'md'} label="Title" placeholder='Course Title' {...form.getInputProps('title')} />
                            <Textarea size='sm' radius={'md'} label="Description" minRows={6} placeholder='Course Description' {...form.getInputProps('description')} />
                            <TextInput size='sm' radius={'md'} label="Banner Image" {...form.getInputProps('banner')} />
                            <>
                                <Title order={3} fw={400}>More about the course</Title>
                                <CustomRTE content={form.values.notes} updateForm={updateFormCourseContent} readonly={false} />
                            </>
                            {
                                !updating ? (
                                    <Card radius={'md'}>
                                        <Group justify='space-between' align='end'>
                                            <Stack gap={0}>
                                                <Title order={3} fw={400}>Topics</Title>
                                                <Text size='sm' fw={500} c={'dimmed'}>Add Main Topics to this course</Text>
                                            </Stack>
                                            <Button onClick={() => addTopic(null)} size='sm' radius={'md'}>Add Topic</Button>
                                        </Group>
                                    </Card>
                                ) : null
                            }
                            {/* {
                                form.values.topics.map((topic: any, i: any) => (
                                    <TopicFormFields key={`topic_${i}`} form={form} addTopic={addTopic} index={i} parentIndex={null} formkey="topics" />
                                ))
                            } */}
                            {
                                form.values?.topics?.map((topic: any, i: number) => <SingleTopicForm key={`topic_${i}`} form={form} path={`topics.${i}`} topic={topic} />)
                            }
                            {
                                !updating ? form.values.topics?.length > 2 ? (
                                    <Card radius={'md'}>
                                        <Group justify='space-between' align='end'>
                                            <Stack gap={0}>
                                                <Title order={3} fw={400}>Topics</Title>
                                                <Text size='sm' fw={500} c={'dimmed'}>Add Main Topics to this course</Text>
                                            </Stack>
                                            <Button onClick={() => addTopic(null)} size='sm' radius={'md'}>Add Topic</Button>
                                        </Group>
                                    </Card>
                                ) : null : null
                            }

                            <Box>
                                <Button type='submit' radius={'md'}>
                                    {buttonLabel}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Grid.Col>
                {/* <Grid.Col md={5}>
                    <Prism language='json'>
                        {JSON.stringify(form.values, null, 4)}
                    </Prism>
                </Grid.Col> */}
            </Grid>
        </Card>
    )
}

export default AddCourseForm