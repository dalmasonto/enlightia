import { Anchor, Button, Grid, Group, LoadingOverlay, MultiSelect, Paper, Select, TextInput, Textarea, Title, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import React, { useState } from 'react'
import { isDarkMode, makeRequestOne } from '../../config/config'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { useAppContext } from '../../providers/appProvider'
import { displayErrors } from '../../config/functions'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { API_ENDPOINTS } from '@/config/constants'
import { IconArrowForward } from '@tabler/icons-react'

interface ITestForm {
    test?: any
    updating: boolean
    cohorts: any
    topics: any
    cid: any
}

const TestForm = (props: ITestForm) => {
    const { test, updating, cohorts, topics, cid } = props
    const [loading, setLoading] = useState(false)
    const { token, user_id } = useAppContext()
    const { query } = useRouter()

    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()
    const topics_ = test?.topics.map((topic: any) => topic?.id?.toString())

    const form = useForm({
        initialValues: {
            title: updating ? test?.title : "",
            description: updating ? test?.description : "",
            cohort: updating ? test?.cohort?.id?.toString() : "",
            topics: updating ? topics_ : [],
        }
    })

    const handleTest = () => {
        setLoading(true)
        let reqParams = {
            method: 'POST',
            url: API_ENDPOINTS.TESTS
        }
        if (updating) {
            reqParams.method = 'PUT'
            reqParams.url = `${API_ENDPOINTS.TESTS}/${test.id}`
        }
        makeRequestOne({
            ...reqParams,
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            data: {
                ...form.values,
                course: cid,
                created_by: updating ? test?.created_by : user_id,
            },
            useNext: false
        }).then((res: any) => {
            showNotification({
                title: updating ? "Update succesful" : "Create Successful",
                message: updating ? "You have succesfully updated your test" : "You have successfully created a test",
                color: "green"
            })
            if (!updating) {
                form.reset()
            }
        }).catch(error => {
            const errors = error?.response?.data
            displayErrors(form, errors)
            showNotification({
                title: "Error",
                message: "An unknown error has occured. Pleas try again later!",
                color: "red"
            })
        }).finally(() => {
            setLoading(false)
        })
    }
    const getTestUrl = () => {
        if (updating) {
            const testUrl = `/institution/admin/${query.id}/${query.slug}/courses/${query.cid}/${query.cslug}/tests/${test.id}/${test.slug}/`
            return testUrl
        }
        return "#"
    }
    return (
        <Paper radius="md" p="md" style={{
            position: "relative",
            background: isDarkMode(colorScheme) ? theme.colors.dark[7] : theme.colors.gray[0]
        }}>

            <LoadingOverlay visible={loading} />
            <Group justify='space-between'>
                <Title>
                    {updating ? test?.title : "Create New Test"}
                </Title>
                {
                    updating ? (
                        <Anchor component={Link} href={getTestUrl()} size="sm">
                            <Button size='xs' radius="md" rightSection={<IconArrowForward />} variant='light'>
                                More Info
                            </Button>
                        </Anchor>
                    ) : null
                }
            </Group>
            <form onSubmit={form.onSubmit((values) => handleTest())}>
                <Grid>
                    <Grid.Col span={{ md: 6 }}>
                        <TextInput label="Test title" placeholder='Give the test a title' {...form.getInputProps('title')} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 6 }}>
                        <Select label="Cohort" searchable clearable data={
                            cohorts ? cohorts?.map((cohort: any) => ({ label: cohort?.title, value: cohort?.id?.toString() })) : []
                        } {...form.getInputProps('cohort')} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 12 }}>
                        <MultiSelect label="Topic" searchable clearable data={
                            topics ? topics?.map((topic: any) => ({ label: topic?.title, value: topic?.id?.toString() })) : []
                        } {...form.getInputProps('topics')} />
                    </Grid.Col>
                    <Grid.Col>
                        <Textarea label="Test Description"
                            placeholder='Give more information about the test here'
                            {...form.getInputProps('description')} />
                    </Grid.Col>
                    <Grid.Col>
                        <Button type='submit' radius={'md'} variant='light'>
                            {
                                updating ? "Update Test" : "Create Test"
                            }
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </Paper>
    )
}

export default TestForm