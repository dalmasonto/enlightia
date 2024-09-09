import { Alert, Box, Button, Card, Checkbox, darken, Divider, Group, lighten, NumberInput, Radio, Stack, Text, Textarea, TextInput, Title, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import React, { useEffect } from 'react'
import CustomRTE from '../forms/customRTE/CustomRTE'
import { isDarkMode } from '@/config/config'
import { useDebouncedState } from '@mantine/hooks'
import { calculatePoints, getScoreColor } from '@/config/functions'
import { IconAlertTriangle } from '@tabler/icons-react'
import dynamic from 'next/dynamic'

const DynamicCustomRTE = dynamic(() => import('../forms/customRTE/CustomRTE'), {
    loading: () => <p>Loading...</p>,
})


interface IRenderQuestion {
    form: any
    question: any
    index: any
    readonly: boolean
}

interface IRenderWithAnswerQuestion {
    form: any
    answer: any
    index: any
    readonly: boolean
    isInstructor: boolean
}


export const RenderWithAnswerQuestion = ({ form, answer, index, readonly, isInstructor }: IRenderWithAnswerQuestion) => {

    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()
    const isDark = isDarkMode(colorScheme)

    function getOptionBackgroundColor(option: any, selectedAnswers: number[]) {
        if (option.is_correct) {
            return isDark ? darken(theme.colors.green[9], 0.6) : lighten(theme.colors.green[3], 0.1);
        } else if (selectedAnswers.includes(option.id)) {
            return isDark ? darken(theme.colors.red[9], 0.6) : lighten(theme.colors.red[3], 0.1);
        } else {
            return isDark ? theme.colors.dark[7] : theme.colors.gray[0];
        }
    }

    useEffect(() => {
        if (answer?.quiz?.question_type !== 'oe') {
            let points = calculatePoints(answer?.quiz?.options, answer?.answers, answer?.quiz?.points)
            form.setFieldValue(`answers.${index}.points`, points)
        }
    }, [])

    return (
        <div>
            <Card radius={'lg'} p="md" shadow='lg' bg={isDark ? theme.colors.dark[8] : theme.colors.gray[1]} style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: answer?.marked ? theme.colors[getScoreColor(answer?.points, answer?.quiz?.points)][6] : "transparent"
            }}>
                <Stack>
                    <Group justify='space-between'>
                        <Title fw={500} order={3}>{`Question ${index + 1} (${answer?.quiz?.points} Pts)`}</Title>
                        {
                            answer?.marked ? (
                                <Button variant='light' radius={'md'} size='sm' color={getScoreColor(answer?.points, answer?.quiz?.points)}>
                                    {`${parseFloat(answer?.points).toFixed(1)}/${answer?.quiz?.points}.0 points`}
                                </Button>
                            ) : null
                        }
                    </Group>
                    <Divider />
                    <Box>
                        <DynamicCustomRTE content={answer?.quiz?.question} readonly={true} padding='0' />
                    </Box>
                    {
                        answer?.quiz?.question_type === 'oe' ? (
                            <Box bg={isDark ? theme.colors.dark[6] : theme.colors.gray[2]} p={'xs'} style={{
                                borderRadius: theme.radius.md
                            }}>
                                <CustomRTE content={answer?.written_answer ?? "N/A"} updateForm={() => { }} readonly={readonly} height='300px' />
                            </Box>
                        ) : null
                    }
                    {
                        answer?.quiz?.question_type === 'sc' ? (
                            <>
                                {
                                    answer?.quiz?.options?.map((option: any, i: any) => (
                                        <Box className='option' mb="xs" key={`answer_${i}_${index}`} p={'xs'} style={{
                                            cursor: "default",
                                            background: getOptionBackgroundColor(option, answer.answers),
                                            borderRadius: theme.radius.md
                                        }}>
                                            <Group wrap='nowrap'>
                                                <Radio disabled={true} value={option?.id?.toString()}
                                                    defaultChecked={answer?.answers[0] === option?.id}
                                                    color={(answer?.answers[0] === option?.id && option?.is_correct) ? 'green' : 'red'}
                                                />
                                                <CustomRTE content={option.answer} readonly={true} padding='0' />
                                            </Group>
                                        </Box>
                                    ))
                                }
                            </>
                        ) : null
                    }
                    {
                        answer?.quiz?.question_type === 'mc' ? (
                            <>
                                {
                                    answer?.quiz?.options?.map((option: any, i: any) => (
                                        <Box className='option' mb="xs" key={`answer_${i}_${index}`} p={'xs'} style={{
                                            cursor: "default",
                                            background: getOptionBackgroundColor(option, answer.answers),
                                            borderRadius: theme.radius.md
                                        }}>
                                            <Group wrap='nowrap'>
                                                <Checkbox
                                                    disabled={true}
                                                    defaultChecked={answer?.answers?.includes(option?.id)}
                                                    color={(answer?.answers?.includes(option?.id) && option?.is_correct) ? 'green' : 'red'}
                                                />
                                                <CustomRTE content={option.answer} readonly={true} padding='0' />
                                            </Group>
                                        </Box>
                                    ))
                                }
                            </>
                        ) : null
                    }
                    {
                        isInstructor ? (
                            <Stack bg={isDark ? theme.colors.dark[9] : theme.colors.gray[3]} p={"xs"} style={{ borderRadius: theme.radius.md }}>
                                <NumberInput max={answer?.quiz?.points} label="Points" allowDecimal placeholder='Answer Points' {...form.getInputProps(`answers.${index}.points`)} radius={'md'} />
                                <Textarea label="Instructor Note" placeholder='Instructor Note' {...form.getInputProps(`answers.${index}.instructor_note`)} radius={'md'} />
                            </Stack>
                        ) : (
                            <>
                                {
                                    answer?.instructor_note ? (
                                        <Alert title="Note" icon={<IconAlertTriangle />} radius={'md'}>
                                            <Text>
                                                {answer?.instructor_note ?? ""}
                                            </Text>
                                        </Alert>
                                    ) : null
                                }
                            </>
                        )
                    }

                </Stack>
            </Card>
        </div>
    )
}

const RenderQuestion = ({ form, question, index }: IRenderQuestion) => {
    const [AnswerContent, setAnswerContent] = useDebouncedState(form.values.answers[index]?.written_answer, 500)
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()
    const isDark = isDarkMode(colorScheme)

    const updateFormAnswerContent = (new_val: any) => {
        setAnswerContent(new_val)
    }

    const getPlural = () => {
        if (question?.points) {
            if (question.points > 1 || question.points === 0) {
                return 's'
            }
            return ''
        }
        return ''
    }

    useEffect(() => {
        form.setFieldValue(`answers.${index}.written_answer`, AnswerContent)
    }, [AnswerContent])

    return (
        <div>
            <Card radius={'lg'} p="md" shadow='lg' bg={isDark ? theme.colors.dark[8] : theme.colors.gray[1]}>
                <Stack>
                    <Title fw={400} order={3} ta={'center'}>{`Question ${index + 1}`}</Title>
                    <Divider />
                    <Box>
                        <CustomRTE content={question?.question} readonly={true} padding='0' />
                    </Box>
                    <Group>
                        <Button variant='light' radius={'md'} size='sm'>
                            {`${question.points} Point${getPlural()}`}
                        </Button>
                    </Group>
                    {
                        question?.question_type === 'oe' ? (
                            <CustomRTE content={form.values.answers[index]?.written_answer} updateForm={updateFormAnswerContent} readonly={false} height='300px' />
                        ) : null
                    }
                    {
                        question?.question_type === 'sc' ? (
                            <Radio.Group {...form.getInputProps(`answers.${index}.answers`)}>
                                {
                                    question?.options?.map((option: any, i: any) => (
                                        <Box className='option' mb="xs" key={`answer_${i}_${index}`} p={'xs'} style={{
                                            cursor: "pointer",
                                            background:
                                                form.values.answers[index].answers === option?.id?.toString() ? isDark ? darken(theme.colors[theme.primaryColor][3], 0.8) : lighten(theme.colors[theme.primaryColor][6], 0.8)
                                                    :
                                                    isDark ? theme.colors.dark[7] : theme.colors.gray[0],
                                            borderColor: form.values.answers[index].answers === option?.id?.toString() ? theme.colors[theme.primaryColor][isDark ? 5 : 4] : "transparent",
                                            borderWidth: "2px",
                                            borderStyle: "solid",
                                            borderRadius: theme.radius.md
                                        }}>
                                            <Group wrap='nowrap'>
                                                <Radio value={option?.id?.toString()} />
                                                <CustomRTE content={option.answer} readonly={true} padding='0' />
                                            </Group>
                                        </Box>
                                    ))
                                }
                            </Radio.Group>
                        ) : null
                    }
                    {
                        question?.question_type === 'mc' ? (
                            <Checkbox.Group
                                size='sm'
                                {...form.getInputProps(`answers.${index}.answers`)}
                            >
                                {
                                    question?.options?.map((option: any, i: any) => (
                                        <Box className='option' mb="xs" key={`answer_${i}_${index}`} p={'xs'} style={{
                                            cursor: "pointer",
                                            background:
                                                form.values.answers[index].answers.includes(option?.id?.toString()) ? isDark ? darken(theme.colors[theme.primaryColor][3], 0.8) : lighten(theme.colors[theme.primaryColor][6], 0.8)
                                                    :
                                                    isDark ? theme.colors.dark[7] : theme.colors.gray[0],
                                            borderColor: form.values.answers[index].answers.includes(option?.id?.toString()) ? theme.colors[theme.primaryColor][isDark ? 5 : 4] : "transparent",
                                            borderWidth: "2px",
                                            borderStyle: "solid",
                                            borderRadius: theme.radius.md
                                        }}>
                                            <Group wrap='nowrap'>
                                                <Checkbox value={option?.id?.toString()} />
                                                <CustomRTE content={option.answer} readonly={true} padding='0' />
                                            </Group>
                                        </Box>
                                    ))
                                }
                            </Checkbox.Group>
                        ) : null
                    }
                </Stack>
            </Card>
        </div>
    )
}

export default RenderQuestion
