import { isDarkMode, makeRequestOne } from '@/config/config'
import { API_ENDPOINTS, EMOJIS } from '@/config/constants'
import { displayErrors, getFieldByPrefix } from '@/config/functions'
import { useAppContext } from '@/providers/appProvider'
import { Stack, Divider, Radio, Space, Group, Checkbox, Text, Box, Button, LoadingOverlay, Overlay, Card, useMantineTheme, useMantineColorScheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useState, useEffect } from 'react'

function getIndex(path: string) {
    return path.split('.')[1]
}

interface ITestForm {
    test: any
}

const TestQuizForm = ({ test }: ITestForm) => {
    const [loading, setLoading] = useState(false)
    const { user, token } = useAppContext()
    const [isCompleted, setIsCompleted] = useState(false)
    const theme = useMantineTheme()
    const {colorScheme} = useMantineColorScheme()

    const questionAnswers = test?.questions?.map((quiz: any) => ({
        test: test?.id,
        quiz: quiz?.id,
        answers: [],
        json_written_answer: [],
        score: 0,
        quiz_type: quiz.type
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
                    if (quiz_type === '0') return null
                    if (value?.length === 0) {
                        return "Please select the possible answer(s)."
                    }
                },
                json_written_answer: (value, values, path) => {
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
                message: "You have already done the test!"
            })
            return;
        }

        setLoading(true)
        const data = form.values.answers.map((answer: any) => {
            if (answer.quiz_type === "1") {
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
            url: API_ENDPOINTS.TEST_ANSWERS,
            method: 'POST',
            data: data,
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            useNext: true,
        }).then(res => {
            markTestAsCompleted()
            showNotification({
                title: `Test submitted successfully! ${EMOJIS.partypopper.repeat(3)}`,
                message: 'You have successfully completed this test, you cannot be able to redo it again.',
                color: "green",
                icon: <IconCheck />
            })
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

    function markTestAsCompleted() {
        makeRequestOne({
            url: API_ENDPOINTS.COMPLETED_TESTS,
            method: "POST",
            data: {
                test: test?.id,
                student: user?.student,
                created_by: user?.id,

            },
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            useNext: true
        }).then(res => {

        }).catch(() => { })
    }

    function checkTestStatus() {
        makeRequestOne({
            url: API_ENDPOINTS.COMPLETED_TESTS,
            method: "GET",
            params: {
                fields: "id",
                test__id: test?.id
            },
            useNext: true
        }).then((res: any) => {
            const count = res?.data?.count
            if (count > 0) {
                setIsCompleted(true)
            }
        }).catch(() => { })
    }

    useEffect(() => {
        checkTestStatus()
    }, [])

    return (
        <div style={{ position: "relative" }}>
            <LoadingOverlay visible={loading} />
            <Overlay p="sm" radius="md" display={isCompleted ? "block" : "none"}>
                <Card radius="md">
                    <Text color='green'>You have already done this test</Text>
                </Card>
            </Overlay>
            <form onSubmit={form.onSubmit(values => submitTest())}>
                {
                    test?.questions?.map((question: any, i: number) => (
                        <Stack mb="md" p="md" key={`question_${question.id}`} style={theme => ({
                            background: isDarkMode(colorScheme) ? theme.colors.dark[5] : theme.colors.gray[1],
                            borderRadius: theme.radius.lg
                        })}>
                            <Text fw={600}>Question {i + 1}</Text>
                            {/* <CustomRenderer data={question.question} /> */}
                            <Divider />
                            {
                                question?.type === '0' ? (
                                    <>
                                        <Text>Write your answer below</Text>
                                        {/* <MyJSONDataForm form={form} fieldPrefix={`answers.${i}.json_written_answer`} /> */}
                                        <Text color='red' size="sm">
                                            {form.errors[`answers.${i}.json_written_answer`]}
                                        </Text>
                                    </>
                                ) : null
                            }
                            {
                                question?.type === '1' ? (
                                    <Radio.Group
                                        // name="favoriteFramework"
                                        label="Select your favorite framework/library"
                                        description="This is anonymous"
                                        withAsterisk
                                        {...form.getInputProps(`answers.${i}.answers`)}
                                    >
                                        <Space h="md" />
                                        {
                                            question?.answers?.map((answer: any) => (
                                                <Group key={`answer_${answer.id}`} mb="xs">
                                                    <Radio size='lg' value={answer?.id?.toString()} />
                                                    <div style={{ flex: 1 }}>
                                                        {/* <CustomRenderer data={answer?.answer} /> */}
                                                    </div>
                                                </Group>
                                            ))
                                        }
                                    </Radio.Group>
                                ) : null
                            }
                            {
                                question?.type === '2' ? (
                                    <Checkbox.Group
                                        size='lg'
                                        {...form.getInputProps(`answers.${i}.answers`)}
                                    >
                                        {
                                            question?.answers?.map((answer: any) => (
                                                <Group key={`answer_${answer.id}`} align='center' mb="xs">
                                                    <Checkbox value={answer?.id?.toString()} size="lg" />
                                                    <div style={{ flex: 1 }}>
                                                        {/* <CustomRenderer data={answer?.answer} /> */}
                                                    </div>
                                                </Group>
                                            ))
                                        }
                                    </Checkbox.Group>
                                ) : null
                            }
                        </Stack>
                    ))
                }
                <Box>
                    <Button size='lg' type='submit' disabled={isCompleted}>
                        {
                            isCompleted ? "Test already done" : "Submit Test"
                        }
                    </Button>
                </Box>
            </form>
        </div>
    )
}

export default TestQuizForm