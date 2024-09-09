import React, { useState } from 'react'
import RenderQuestion, { RenderWithAnswerQuestion } from './RenderQuestion'
import { Alert, Box, Button, Center, Grid, Group, NumberInput, Pagination, RingProgress, Stack, Text, Textarea, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { calculateTotalPoints, displayErrors, getFieldByPrefix, getScoreColor } from '@/config/functions'
import { isDarkMode, makeRequestOne } from '@/config/config'
import { API_ENDPOINTS, EMOJIS } from '@/config/constants'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useAppContext } from '@/providers/appProvider'
import dynamic from 'next/dynamic'
import { DonutChart } from '@mantine/charts'
import { useRouter } from 'next/router'
import RenderQuizFormForStudent from './RenderQuizFormForStudent'

const DynamicRenderWithAnswerQuestion = dynamic(() => import('./RenderQuestion').then(mod => mod.RenderWithAnswerQuestion), {
    loading: () => <p>Loading...</p>,
})


interface ITestScoreCard {
    instructor_note: any
    myPoints: any
    totalPoints: any
}

const TestScoreCard = ({ instructor_note, myPoints, totalPoints }: ITestScoreCard) => {

    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()

    const calculateTotalScore = () => {
        let myScore = Math.round((myPoints / totalPoints) * 100)
        let missedScore = 100 - myScore
        return ({
            myScore: myScore > 100 ? 100 : myScore,
            missedScore: missedScore
        })
    }

    return (
        <Alert color={theme.primaryColor} radius={'lg'}>
            <Center>
                <RingProgress
                    size={170}
                    thickness={10}
                    sections={[
                        { value: calculateTotalScore().myScore, color: getScoreColor(calculateTotalScore().myScore, 100) },
                        { value: calculateTotalScore().missedScore, color: isDarkMode(colorScheme) ? theme.colors.dark[7] : theme.colors.gray[2] },
                    ]}
                    label={(<Stack ta={'center'} gap={0}>
                        <Text size='xs' mb={0} pb={0}>Score</Text>
                        <Text ta={'center'} c={`${getScoreColor(calculateTotalScore().myScore, 100)}.9`} fw={700} size='xl'>{calculateTotalScore().myScore}%</Text>
                        <Text size='sms' mb={0} fw={500} pb={0}>{`${myPoints}/${totalPoints} Pts`}</Text>
                    </Stack>)}
                />
            </Center>
            <Text ta={'center'} maw={'500px'} mx={'auto'} fw={500}>
                {instructor_note}
            </Text>
        </Alert>
    )
}

const RenderQuiz = ({ questions, testID, completedTest, isInstructor }: { questions: any, testID: any, completedTest?: any, isInstructor: boolean }) => {

    const [loading, setLoading] = useState(false)
    const { user, token, user_id } = useAppContext()
    const isCompleted = completedTest ? true : false
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()

    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage, setQuestionsPerPage] = useState(2); // Adjust as needed
    const { reload } = useRouter()

    const instructorForm = useForm({
        initialValues: {
            answers: completedTest?.answers?.map((answer: any) => ({
                ...answer,
                id: answer?.id,
                instructor_note: answer?.instructor_note ?? "",
                points: answer?.points ?? "",
                // written_answer: answer?.written_answer
            })),
            instructor_note: completedTest?.instructor_note ?? "",
            points: completedTest?.points ?? "",
            checked: completedTest?.checked ?? false,
        },
        validate: {
            answers: {
                points: (value) => value === "" ? "Enter points for this answer" : null,
            },
            instructor_note: value => value === "" ? "Instructor Note for test are required" : null
        }
    })

    const submitInstructorForm = () => {

        setLoading(true)
        const _data = structuredClone(instructorForm.values)
        const answers = _data.answers.map((ans: any) => ({
            ...ans,
            quiz: ans.quiz.id,
            marked: true
        }))
        let totalPoints = calculateTotalPoints(instructorForm.values)
        const data = {
            instructor_note: _data.instructor_note,
            points: totalPoints,
            checked: true,
            answers,
        }

        setLoading(false)

        makeRequestOne({
            url: `${API_ENDPOINTS.COMPLETED_TESTS}/${completedTest?.id}`,
            method: 'PATCH',
            data: data,
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            useNext: false,
        }).then(res => {
            // markTestAsCompleted()
            showNotification({
                title: `Test checked successfully! ${EMOJIS.partypopper.repeat(3)}`,
                message: 'You have successfully checked this test, you can check it again.',
                color: "green",
                icon: <IconCheck />
            })
            reload()
        }).catch(err => {
            const errors = err?.response?.data
            displayErrors(instructorForm, errors)
            showNotification({
                title: `Test check failed! ${EMOJIS.monocle_face}`,
                message: 'We could not check this test now! Try again',
                color: "red",
                icon: <IconX />
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const totalPages = Math.ceil(completedTest?.answers?.length / questionsPerPage);


    return (
        <>
            {
                isCompleted ? (
                    <form onSubmit={instructorForm.onSubmit(values => submitInstructorForm())}>
                        <Grid>
                            <Grid.Col span={{ md: 7 }}>
                                <Stack>
                                    <Center mb={'lg'}>
                                        <Pagination radius={'xl'} withEdges total={totalPages} value={currentPage} onChange={setCurrentPage} siblings={4} />
                                    </Center>
                                    {
                                        instructorForm.values.answers.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage)?.map((answer: any, i: number) => (
                                            <DynamicRenderWithAnswerQuestion form={instructorForm} key={`answer_uestion_${((currentPage - 1) * questionsPerPage) + i}`} answer={answer} index={((currentPage - 1) * questionsPerPage) + i} readonly={true} isInstructor={isInstructor} />
                                        ))
                                    }
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={{ md: 5 }}>
                                <Stack>
                                    {
                                        completedTest?.checked ? (
                                            <TestScoreCard instructor_note={completedTest?.instructor_note} myPoints={completedTest?.points} totalPoints={completedTest?.test?.total_points} />
                                        ) : (
                                            <Box h={'200px'}>
                                                <Center className='h-100'>
                                                    <Alert radius={'md'}>
                                                        <Text ta={'center'}>Awaiting check from Instructor</Text>
                                                    </Alert>
                                                </Center>
                                            </Box>
                                        )
                                    }
                                    {
                                        isInstructor ? (
                                            <Stack bg={isDarkMode(colorScheme) ? theme.colors.dark[9] : theme.colors.gray[3]} p={"xs"} style={{ borderRadius: theme.radius.md }}>
                                                <NumberInput disabled label="Total Points" placeholder='Answer Points' {...instructorForm.getInputProps(`points`)} radius={'md'} />
                                                <Textarea label="Instructor Note" description="Overal Note for the student about this text" placeholder='Instructor Note' {...instructorForm.getInputProps(`instructor_note`)} radius={'md'} />

                                                <Group justify='center'>
                                                    <Button size='sm' loading={loading} type={'submit'} radius={'md'}>
                                                        Mark Test
                                                    </Button>
                                                </Group>
                                            </Stack>
                                        ) : null
                                    }
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </form>
                ) : (
                    <RenderQuizFormForStudent questions={questions} testID={testID} completedTest={completedTest} />
                )
            }
        </>
    )
}

export default RenderQuiz