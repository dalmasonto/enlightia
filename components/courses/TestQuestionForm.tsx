import { isDarkMode, makeRequestOne } from '@/config/config'
import { API_ENDPOINTS, EMOJIS, QUESTION_TYPES } from '@/config/constants'
import { displayErrors, getTheme } from '@/config/functions'
import { useAppContext } from '@/providers/appProvider'
import { Paper, LoadingOverlay, Group, Title, Button, Grid, Select, NumberInput, NavLink, Accordion, Checkbox, Box, Text, useMantineTheme, useMantineColorScheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconTrash, IconPlus, IconLetterT } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'


interface ITestQuestionForm {
    updating: boolean
    question?: any
    quizIndex?: number
}

const TestQuestionForm = ({ updating, question, quizIndex }: ITestQuestionForm) => {
    
    const [loading, setLoading] = useState(false)
    const { token, user_id } = useAppContext()
    const { query, reload } = useRouter()
    const theme = useMantineTheme()
    const {colorScheme} = useMantineColorScheme()

    const form = useForm({
        initialValues: {
            question: updating ? question?.question : [],
            type: updating ? question?.type : "",
            score: updating ? question?.score : "",
            answers: updating ? question?.answers : []
        },
        validate: {
            type: value => value === "" ? "Question type required" : null,
            score: value => value === "" ? "Score required" : null,
        }
    })

    const handleCreateQuestion = () => {
        setLoading(true)
        let METHOD = 'POST'
        let URL = API_ENDPOINTS.TEST_QUESTIONS
        if (updating) {
            METHOD = 'PUT',
                URL = `${API_ENDPOINTS.TEST_QUESTIONS}/${question?.id}`
        }
        makeRequestOne({
            url: URL,
            method: METHOD,
            data: {
                ...form.values,
                test: query.testID,
                created_by: user_id
            },
            useNext: true,
            extra_headers: {
                authorization: `Bearer ${token}`
            }
        }).then((res: any) => {
            showNotification({
                title: `Success ${EMOJIS.smiley}`,
                message: "Question posted successfully",
                color: "green"
            })
        }).catch(error => {
            const errors = error?.response?.data
            displayErrors(form, errors)
            showNotification({
                title: "Failed ",
                message: "We are unable to post your question right now!",
                color: "red"
            })
        }).finally(() => {
            setLoading(false)
        })

    }

    const addAnswer = () => {
        const answer = {
            answer: [],
            is_right_answer: false
        }
        form.insertListItem('answers', answer)
    }

    const removeAnswer = (index: number) => {
        form.removeListItem('answers', index)
    }

    const deleteQuestion = () => {
        setLoading(true)
        makeRequestOne({
            method: 'DELETE',
            url: `${API_ENDPOINTS.TEST_QUESTIONS}/${question?.id}`,
            extra_headers: {
                authorization: `Bearer ${token}`
            }
        }).then(res => {
            showNotification({
                title: "Delete Successful",
                message: "You have successfully delete the question",
                color: 'green'
            })
            reload()
        }).catch(err => {
            showNotification({
                title: "Delete failed!",
                message: "Deleting the question failed.",
                color: 'red'
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const initiateDeleteQuestion = () => modals.openConfirmModal({
        title: 'About to delete a question',
        children: (
            <>
                <Text>Are you sure you want to proceed with this action?</Text>
            </>
        ),
        labels: {confirm: "Delete", cancel: "Cancel"},
        confirmProps: {color: "red", radius: "xl"},
        cancelProps: {color: "blue", radius: "xl"},
        onConfirm: () => deleteQuestion(),
        centered: true,
        radius: "lg"
    })

    const buttonLabel = updating ? "Update" : "Save question"

    return (
        <Paper radius="lg" p="md" style={theme => ({
            background: isDarkMode(colorScheme) ? theme.colors.dark[6] : theme.colors.gray[1],
            position: "relative"
        })}>
            <LoadingOverlay visible={loading} />
            <Group justify='apart'>
                <Title>
                    {
                        updating ? `${quizIndex ? `${quizIndex}. `: ''}Update question` : "Create new question"
                    }
                </Title>
                {
                    updating ? (
                        <Button onClick={initiateDeleteQuestion} color='red' leftSection={<IconTrash />} radius="md">
                            Delete Question
                        </Button>
                    ) : null
                }
            </Group>
            <form onSubmit={form.onSubmit(values => handleCreateQuestion())}>
                <Grid>
                    <Grid.Col span={{md: 6}}>
                        <Select
                            label="Question Type"
                            data={QUESTION_TYPES.map(type => ({ value: type[0], label: type[1] }))}
                            {...form.getInputProps('type')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{md: 6}}>
                        <NumberInput
                            label="Score"
                            min={1}
                            decimalScale={1}
                            step={0.5}
                            {...form.getInputProps('score')}
                        />
                    </Grid.Col>
                </Grid>
                <NavLink label="Question Details">
                    {/* <MyJSONDataForm form={form} fieldPrefix={`question`} /> */}
                </NavLink>
                <NavLink mb="md" label="Question Answers">
                    <Button mb="md" rightSection={<IconPlus />} size='xs' onClick={addAnswer}>Add Answer</Button>
                    <Accordion radius="lg" defaultValue={`detail_0`} style={theme => ({
                        background: isDarkMode(colorScheme) ? theme.colors.dark[5] : theme.colors.gray[0],
                    })}>
                        {
                            form.values.answers.map((answer: any, i: number) => (
                                <Accordion.Item value={`field_${i + 1}`} key={`field_${i + 1}`}>
                                    <Accordion.Control icon={<IconLetterT />}>
                                        <Text>Answer #{i + 1}</Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Paper radius="md" p="md" my="xs">
                                            <Checkbox
                                                label="Is it the correct answer?"
                                                {...form.getInputProps(`answers.${i}.is_right_answer`, { type: 'checkbox' })} />
                                            {/* <MyJSONDataForm form={form} fieldPrefix={`answers.${i}.answer`} /> */}
                                        </Paper>
                                        <Button mb="sm" rightSection={<IconTrash />} size='sm' radius="md" color='red' onClick={() => removeAnswer(i)}>Delete Answer</Button>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))
                        }
                    </Accordion>
                </NavLink>
                {/* <Prism language='json'>
                    {JSON.stringify(form.values, null, 4)}
                </Prism> */}
                <Box my="md">
                    <Button type='submit'>
                        {buttonLabel}
                    </Button>
                </Box>
            </form>
        </Paper>
    )
}

export default TestQuestionForm