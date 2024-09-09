import { Accordion, Alert, Box, Button, Card, Group, NumberInput, Select, Stack, TextInput, Title, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import React, { useEffect } from 'react'
import { QuizAccordionLabel } from './QuizAccordionComponents'
import { IconCheck, IconChecks, IconInfoCircle, IconQuestionMark, IconX } from '@tabler/icons-react'
import CustomRTE from '../forms/customRTE/CustomRTE'
import { useDebouncedState } from '@mantine/hooks'
import { isDarkMode, limitChars, makeRequestOne } from '@/config/config'
import { stripTags } from '@/config/functions'
import { API_ENDPOINTS } from '@/config/constants'
import { useAppContext } from '@/providers/appProvider'

const answerFormat = {
    answer: "",
    is_correct: false
}

interface ICreateOption {
    form: any
    questionindex: number
    index: number
    updating: boolean
    optionID?: any
}

const CreateOptionForm = ({ form, questionindex, index, updating, optionID }: ICreateOption) => {
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()
    const { token } = useAppContext()

    const [optionContent, setoptionContent] = useDebouncedState(form.values.questions[questionindex].options[index].answer, 500)

    const updateFormoptionContent = (new_val: any) => {
        setoptionContent(new_val)
    }

    const correct = form.values.questions[questionindex].options[index].is_correct
    const question_type = form.values.questions[questionindex].question_type
    const options = form.values.questions[questionindex].options

    const markAscorrectIncorrect = () => {
        if (question_type === 'sc') {
            options.map((opt: any, i: number) => {
                form.setFieldValue(`questions.${questionindex}.options.${i}.is_correct`, false)
            })
            form.setFieldValue(`questions.${questionindex}.options.${index}.is_correct`, !correct)
        }
        else {
            form.setFieldValue(`questions.${questionindex}.options.${index}.is_correct`, !correct)
        }
    }

    const deleteOption = () => {
        if (updating) {
            makeRequestOne({
                url: `${API_ENDPOINTS.TEST_QUESTION_OPTIONS}/${optionID}`,
                method: "DELETE",
                extra_headers: {
                    AUTHORIZATION: `Bearer ${token}`
                }
            }).then(() => {
                form.removeListItem(`questions.${questionindex}.options`, index)
            }).catch(() => {

            })
        } else {
            form.removeListItem(`questions.${questionindex}.options`, index)
        }
    }

    useEffect(() => {
        form.setFieldValue(`questions.${questionindex}.options.${index}.answer`, optionContent)
    }, [optionContent])

    return (
        <Box p={'xs'} style={{
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: correct ? theme.colors.green[8] : "transparent",
            borderRadius: theme.radius.md,
            background: isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[2]
        }}>
            <Stack>
                <CustomRTE content={form.values.questions[questionindex].options[index].answer} readonly={false} updateForm={updateFormoptionContent} height='300px' />
                <Group justify='space-between' align='center'>
                    <Button size='sm' radius={'md'} color={correct ? 'green' : 'yellow'} variant='light' rightSection={correct ? <IconX size={'20px'} /> : <IconCheck size={'20px'} />} onClick={markAscorrectIncorrect}>Mark as {correct ? "Incorrect" : "Correct"}</Button>
                    <Button size='sm' radius={'md'} color='red' variant='light' leftSection={<IconX size={'20px'} />} onClick={deleteOption}>Delete Answer</Button>
                </Group>
            </Stack>
        </Box>
    )
}

interface ICreateQuestion {
    form: any
    index: number
    updating: boolean
    quizID?: any
}

const CreateQuestion = ({ form, index, updating, quizID }: ICreateQuestion) => {

    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()
    const { token } = useAppContext()

    const [questionContent, setquestionContent] = useDebouncedState(form.values.questions[index].question, 500)

    const updateFormquestionContent = (new_val: any) => {
        setquestionContent(new_val)
    }

    const addAnswer = () => {
        form.insertListItem(`questions.${index}.options`, answerFormat)
    }

    const deleteQuestion = () => {
        if (updating) {
            makeRequestOne({
                url: `${API_ENDPOINTS.TEST_QUESTIONS}/${quizID}`,
                method: "DELETE",
                extra_headers: {
                    AUTHORIZATION: `Bearer ${token}`
                }
            }).then(() => {
                form.removeListItem('questions', index)
            }).catch(() => {

            })
        } else {
            form.removeListItem('questions', index)
        }
    }

    useEffect(() => {
        form.setFieldValue(`questions.${index}.question`, questionContent)
    }, [questionContent])

    return (
        <Accordion.Item value={`question_${index + 1}`} bg={isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[0]}>
            <Accordion.Control>
                <QuizAccordionLabel label={`question ${index + 1}`} image={<IconQuestionMark />} description={`${limitChars(stripTags(form.values.questions[index].question), 50, true)}`} />
            </Accordion.Control>
            <Accordion.Panel>
                <Card radius={'lg'} shadow='lg'>
                    <Stack>
                        <Group>
                            <Button size='sm' radius={'lg'} onClick={deleteQuestion} variant='light' color='red' >
                                Delete Question
                            </Button>
                        </Group>
                        <CustomRTE content={form.values.questions[index].question} readonly={false} updateForm={updateFormquestionContent} height='300px' />
                        <Select label={"Qustion Type"} radius={'md'} data={[
                            { value: "sc", label: "Single-Choice" },
                            { value: "mc", label: "Multi-Choice" },
                            { value: "oe", label: "Open Ended" },

                        ]} {...form.getInputProps(`questions.${index}.question_type`)} />
                        <NumberInput min={0} label="Points"  {...form.getInputProps(`questions.${index}.points`)} radius={'md'} />
                        {
                            form.values.questions[index].question_type !== 'oe' ? (
                                <>
                                    <Title order={3} fw={500}>Options</Title>
                                    <Button size='sm' radius={'lg'} onClick={addAnswer} variant='light'>
                                        Add Option
                                    </Button>

                                    <Accordion p={0} radius={'lg'} variant='contained' >
                                        {
                                            form.values.questions[index].options.map((option: any, i: any) => (
                                                <Accordion.Item key={`${index}_answer_${i}`} value={`answer_${i}`} bg={isDarkMode(colorScheme) ? theme.colors.dark[6] : theme.colors.gray[0]}>
                                                    <Accordion.Control variant='contained' >
                                                        <QuizAccordionLabel label={`Option ${i + 1}`} image={<IconChecks
                                                            color={form.values.questions[index].options[i].is_correct ? 'green' : isDarkMode(colorScheme) ? 'gray' : 'gray'} />}
                                                            description={`${limitChars(stripTags(form.values.questions[index].options[i].answer), 50, true)}`} />
                                                    </Accordion.Control>
                                                    <Accordion.Panel >
                                                        <CreateOptionForm form={form} questionindex={index} index={i} updating={option?.id ? true : false} optionID={option?.id} />
                                                    </Accordion.Panel>
                                                </Accordion.Item>
                                            ))
                                        }
                                    </Accordion>
                                </>
                            ) : (
                                <Alert ta={'center'} radius={'md'} icon={<IconInfoCircle />} variant='filled' fw={500}>
                                    Learners answer the question with text!
                                </Alert>
                            )
                        }
                    </Stack>
                </Card>
            </Accordion.Panel>
        </Accordion.Item>
    )
}

export default CreateQuestion