import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS, EMOJIS } from '@/config/constants'
import { getFieldByPrefix, displayErrors } from '@/config/functions'
import { Stack, Pagination, Group, Button, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import React, { useState } from 'react'
import RenderQuestion from './RenderQuestion'
import { useRouter } from 'next/router'
import { useAppContext } from '@/providers/appProvider'

function getIndex(path: string) {
    return path.split('.')[1]
}

const RenderQuizFormForStudent = ({ questions, testID, completedTest }: { questions: any, testID: any, completedTest: any }) => {

    const [loading, setLoading] = useState(false)
    const { user, token, user_id } = useAppContext()
    const isCompleted = completedTest ? true : false
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()

    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage, setQuestionsPerPage] = useState(1); // Adjust as needed

    const { reload } = useRouter()

    const questionAnswers = questions?.map((quiz: any) => ({
        test: testID,
        quiz: quiz?.id,
        answers: [],
        written_answer: "",
        score: 0,
        quiz_type: quiz.question_type
    }))


    const form = useForm({
        initialValues: {
            answers: questionAnswers
        },
        validate: {
            answers: {
                answers: (value, values, path) => {
                    const index = getIndex(path)
                    const fieldPrefix = `answers.${index}.quiz_type`
                    const quiz_type = getFieldByPrefix(values, fieldPrefix)
                    if (quiz_type === 'oe') return null
                    else if (quiz_type === "sc") {
                        if (value?.length === 0) {
                            return "Please select the possible answer."
                        }
                    }
                    else if (quiz_type === "mc") {
                        if (value?.length === 0) {
                            return "Please select the possible answer(s)."
                        }
                    }
                },
                written_answer: (value, values, path) => {
                    const index = getIndex(path)
                    const fieldPrefix = `answers.${index}.quiz_type`
                    const quiz_type = getFieldByPrefix(values, fieldPrefix)
                    if (quiz_type !== '0') return null
                    if (value?.length === 0) {
                        return "Please use the the above form to write your custom answer."
                    }
                }
            }
        }
    })

    const submitTest = () => {

        if (isCompleted) {
            showNotification({
                title: 'Test already done',
                message: "You have already done the test!",
                color: "yellow"
            })
            return;
        }

        setLoading(true)
        const data = form.values.answers.map((answer: any) => {
            if (answer.quiz_type === "sc") {
                return {
                    ...answer,
                    answers: [answer.answers],
                    student: user?.student
                }
            }
            return {
                ...answer,
                student: user?.student
            }
        })

        setLoading(false)

        makeRequestOne({
            url: API_ENDPOINTS.COMPLETED_TESTS,
            method: 'POST',
            data: {
                student: user.student,
                test: testID,
                created_by: user_id,
                answers: data
            },
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            useNext: false,
        }).then(res => {
            // markTestAsCompleted()
            showNotification({
                title: `Test submitted successfully! ${EMOJIS.partypopper.repeat(3)}`,
                message: 'You have successfully completed this test, you cannot be able to redo it again.',
                color: "green",
                icon: <IconCheck />
            })
            reload()
        }).catch(err => {
            const errors = err?.response?.data
            displayErrors(form, errors)
            showNotification({
                title: `Test submission failes! ${EMOJIS.monocle_face}`,
                message: 'We could not submit your test today!',
                color: "ren",
                icon: <IconX />
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const totalPages = Math.ceil(questions?.length / questionsPerPage);

    return (
        <div>
            <form onSubmit={form.onSubmit(values => submitTest())}>
                <Stack>
                    <Pagination radius={'xl'} withEdges total={totalPages} value={currentPage} onChange={setCurrentPage} siblings={60} />
                    {
                        questions.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage)?.map((question: any, i: number) => (
                            <RenderQuestion form={form} key={`question_${((currentPage - 1) * questionsPerPage) + i}`} question={question} index={((currentPage - 1) * questionsPerPage) + i} readonly={false} />
                        ))
                    }
                    <Group justify='center'>
                        <Button size='sm' loading={loading} type={isCompleted ? 'button' : 'submit'} disabled={isCompleted} radius={'md'}>
                            {
                                isCompleted ? "Test already done" : "Submit Test"
                            }
                        </Button>
                    </Group>
                </Stack>
            </form>
        </div>
    )
}

export default RenderQuizFormForStudent