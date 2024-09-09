

import React, { useState } from 'react'
import CreateQuestion from './CreateQuestion'
import { useForm } from '@mantine/form'
import { Accordion, Alert, Button, Card, Grid, Group, Pagination, Stack, Table, Textarea, Title } from '@mantine/core'
import { createQuestions } from './genai'
import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { useAppContext } from '@/providers/appProvider'
import { displayErrors } from '@/config/functions'
import { IconAlertTriangle } from '@tabler/icons-react'
import { showNotification } from '@mantine/notifications'

const placeholder = `Write a nice description of the questions you want ie
i. How many questions
ii. The topic on which the questions will be generated
iii. The intensity/Difficulty of the questions
iv. Purpose of the questions/test
`

const questionFormat = {
    question: "",
    question_type: "sc",
    options: [],
    points: 1
}

interface ICreateQuiz {
    testID: number | string
    questions?: any
    updating: boolean
}

const CreateQuiz = ({ testID, questions, updating }: ICreateQuiz) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage, setQuestionsPerPage] = useState(2); // Adjust as needed
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const form = useForm<any>({
        initialValues: {
            questions: updating ? questions : []
        },
    })

    const form2 = useForm({
        initialValues: {
            description: ""
        },
        validate: {
            description: val => val === "" ? "Test description is required" : null
        }
    })

    const totalPages = Math.ceil(form.values.questions.length / questionsPerPage);

    const addQuestion = () => {
        form.insertListItem('questions', questionFormat)
    }

    const generateQuestions = () => {
        form.clearErrors()
        setLoading(true)
        createQuestions(form2.values.description).then((res) => {
            const questions = JSON.parse(res)
            questions.map((quiz: any) => {
                form.insertListItem('questions', { ...quiz, test: testID })
            })
        }).catch((err: any) => {
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleCreateTestQuestions = () => {
        form.clearErrors()
        setLoading(true)
        let METHOD = 'PATCH'
        if (updating) {
            METHOD = 'PATCH'
        }
        makeRequestOne({
            url: `${API_ENDPOINTS.TESTS}/${testID}`,
            method: METHOD,
            data: {
                questions: form.values.questions,
                total_points: form.values.questions.reduce((old: number, currItem: any, index: number) => old + currItem.points, 0)
            },
            extra_headers: {
                AUTHORIZATION: `Bearer ${token}`
            }
        }).then((res: any) => {
            showNotification({
                message: "Test questions successfully created",
                color: "green",
            })
            // form.reset()
            // form2.reset()
        }).catch((err: any) => {
            displayErrors(form, err?.response?.data)
        }).finally(() => {
            setLoading(false)
        })
    }

    const renderErrors = () => {
        const formErrors = form.errors
        const formErrorKeys = Object.keys(formErrors)
        const errors: { quizNo: number; error: React.ReactNode, field: string }[] = []
        if (formErrorKeys.length > 0) {
            formErrorKeys.map((_key: string) => {
                const quizNo = parseInt(_key.split('.')[0]) + 1
                errors.push({
                    quizNo,
                    error: formErrors[_key],
                    field: _key.split('.')[1]
                })
            })
        }
        return errors
    }

    const getTestData = () => {

        return {
            totalQuestions: form.values.questions.length,
            totalPoints: form.values.questions.reduce((old: number, currItem: any, index: number) => old + currItem.points, 0),
            openQuestions: form.values.questions.filter((quiz: any) => quiz.question_type === 'oe').length,
            singleChoiceQuestions: form.values.questions.filter((quiz: any) => quiz.question_type === 'sc').length,
            multiChoiceQuestions: form.values.questions.filter((quiz: any) => quiz.question_type === 'mc').length,
        }
    }
    const testData = getTestData()

    return (
        <div>
            <Card radius={'lg'} shadow='md'>
                <Grid>
                    <Grid.Col span={{ md: 4 }}>
                        <form onSubmit={form2.onSubmit(() => generateQuestions())}>
                            <Stack>
                                <Textarea {...form2.getInputProps('description')} rows={7} label={'Describe your test here'} radius={'lg'} placeholder={placeholder} />
                                {
                                    renderErrors().map((err, i: number) => (
                                        <Alert key={`error_${i}`} icon={<IconAlertTriangle />} color='red' radius={'md'} title={`Question ${err.quizNo}`}>
                                            {`${err.field} - ${err.error}`}
                                        </Alert>
                                    ))
                                }
                                <Group>
                                    <Button radius={'xl'} variant='light' type='submit' loading={loading}>
                                        Generate Questions
                                    </Button>
                                </Group>
                                <Table withTableBorder verticalSpacing={'sm'} withColumnBorders={true} captionSide='bottom'>
                                    <Table.Caption >
                                        Test Questions Summary
                                    </Table.Caption>
                                    <Table.Tbody>
                                        <Table.Tr>
                                            <Table.Td>Open Questions</Table.Td>
                                            <Table.Td>{testData.openQuestions}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td>Single-Choice Questions</Table.Td>
                                            <Table.Td>{testData.singleChoiceQuestions}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td>Multi-Choice Questions</Table.Td>
                                            <Table.Td>{testData.multiChoiceQuestions}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td>Total Questions</Table.Td>
                                            <Table.Td>{testData.totalQuestions}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td>Total Points</Table.Td>
                                            <Table.Td>{testData.totalPoints}</Table.Td>
                                        </Table.Tr>
                                    </Table.Tbody>
                                </Table> 
                            </Stack>
                        </form>
                    </Grid.Col>
                    <Grid.Col span={{ md: 8 }}>
                        <Stack>
                            <Button onClick={addQuestion} variant='light' radius={'xl'} loading={loading}>
                                Add question
                            </Button>
                            <form onSubmit={form.onSubmit(() => handleCreateTestQuestions())}>
                                <Accordion chevronPosition="right" variant="contained" radius={'lg'}>
                                    {form.values.questions.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage).map((quiz: any, i: number) => (
                                        <CreateQuestion key={`Question_${((currentPage - 1) * questionsPerPage) + i}`} quizID={quiz.id} updating={quiz?.id ? true : false} form={form} index={((currentPage - 1) * questionsPerPage) + i} />
                                    ))}
                                </Accordion>
                            </form>
                            {
                                form.values.questions.length > 0 ? (
                                    <Button radius={'xl'} variant='light' onClick={handleCreateTestQuestions} loading={loading}>
                                        Save Test Questions
                                    </Button>
                                ) : null
                            }
                            <Pagination total={totalPages} value={currentPage} onChange={setCurrentPage} />
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Card>
        </div>
    )
}

export default CreateQuiz