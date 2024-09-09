import { isDarkMode, makeRequestOne } from "@/config/config"
import { API_ENDPOINTS } from "@/config/constants"
import { getTheme } from "@/config/functions"
import { useAppContext } from "@/providers/appProvider"
import { useMantineTheme, Paper, LoadingOverlay, Group, Title, Anchor, Grid, TextInput, Center, Switch, Button, useMantineColorScheme } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { IconArrowForward } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"


interface ICohort {
    cohort?: any
    updating: boolean
    courseID: string
}

const CohortForm = (props: ICohort) => {
    const { cohort, updating, courseID } = props
    const { token, user_id } = useAppContext()
    const [loading, setLoading] = useState(false)
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()
    const { query } = useRouter()

    const form = useForm({
        initialValues: {
            title: updating ? cohort?.title : "",
            start_date: updating ? new Date(cohort?.start_date) : "",
            allows_enrollment: updating ? cohort?.allows_enrollment : false,
            active: updating ? cohort?.active : false,
        },
        validate: {
            start_date: val => val === "" ? "Start Date is required" : null
        }
    })

    const handleCohortCreateUpdate = () => {
        setLoading(true)
        let reqParams = {
            method: 'POST',
            url: API_ENDPOINTS.COHORTS
        }
        if (updating) {
            reqParams.method = 'PUT'
            reqParams.url = `${API_ENDPOINTS.COHORTS}/${cohort.id}`
        }
        makeRequestOne({
            ...reqParams,
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            data: {
                ...form.values,
                start_date: new Date(form.values.start_date).toISOString().split('T')[0],
                course: courseID,
                created_by: updating ? cohort?.created_by : user_id,
            },
            useNext: false
        }).then((res: any) => {

            showNotification({
                title: updating ? "Update succesful" : "Create Successful",
                message: updating ? "You have succesfully updated your cohort" : "You have successfully created a cohort",
                color: "green"
            })
            if (!updating) {
                form.reset()
            }
        }).catch(error => {
            showNotification({
                title: "Error",
                message: "An unknown error has occured. Pleas try again later!",
                color: "red"
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const getCohortURL = () => {
        if (updating) {
            const testUrl = `/institution/admin/${query.id}/${query.slug}/courses/${query.cid}/${query.cslug}/cohorts/${cohort.id}/${cohort.slug}/`
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
            {
                updating ? (
                    <Group justify="space-between" align='center'>
                        <Title fw={400} order={3}>{form.values.title}</Title>
                        <Anchor component={Link} href={getCohortURL()} size="sm">
                            <Button size='xs' radius="md" rightSection={<IconArrowForward />} variant='outline'>
                                Cohort Info
                            </Button>
                        </Anchor>
                    </Group>
                ) : <Title fw={400} order={3}>New Cohort</Title>
            }
            <form onSubmit={form.onSubmit((values) => handleCohortCreateUpdate())}>
                <Grid>
                    <Grid.Col span={{ md: 3 }}>
                        <TextInput label="Cohort title" placeholder='Cohort 2023-4/2023-10' {...form.getInputProps('title')} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 2 }}>
                        <DateInput label="Start Date" {...form.getInputProps('start_date')} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 3 }}>
                        <Center className='h-100'>
                            <Switch label="Allow enrollment" {...form.getInputProps('allows_enrollment', { type: 'checkbox' })} />
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={{ md: 2 }}>
                        <Center className='h-100'>
                            <Switch label="Is Active" {...form.getInputProps('active', { type: 'checkbox' })} />
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={{ md: 2 }}>
                        <Center className='h-100'>
                            <Button type='submit' radius={'md'} variant="light">
                                {
                                    updating ? "Update" : "Save"
                                }
                            </Button>
                        </Center>
                    </Grid.Col>
                </Grid>
            </form>
        </Paper>
    )
}

export default CohortForm