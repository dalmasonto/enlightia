import { isDarkMode, makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { displayErrors, getCoordinates, requestGeolocationPermission } from '@/config/functions'
import { Anchor, Box, Button, Center, Grid, Group, Loader, Stack, Switch, Text, Title, useMantineColorScheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconAlertCircle, IconAlertTriangle, IconLogin } from '@tabler/icons-react'
import Link from 'next/link'
import React, { useState } from 'react'
import CreateUserFormJustInputs from './more_forms/CreateUserFormJustInputs'
import SelectCountyInput from '../common/SelectCountyInput'
import { useAppContext } from '@/providers/appProvider'
import { useRouter } from 'next/router'

const CustomCol = (props: any) => {
    const { children, ...rest } = props
    return (
        <Grid.Col {...rest}>
            {children}
        </Grid.Col>
    )
}

interface ICreateUserForm {
    updating?: boolean
    data?: any
    mutate?: any
    is_admin?: boolean
    hideTitle?: boolean
}


interface IForm {
    [key: string]: any
}

const CreateUserForm = (props: ICreateUserForm) => {
    const { updating, data, mutate, is_admin, hideTitle } = props
    const { colorScheme } = useMantineColorScheme()
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()
    const router = useRouter()

    const form = useForm<IForm>({
        initialValues: {
            user: {
                first_name: updating ? data?.first_name : "",
                last_name: updating ? data?.last_name : "",
                username: updating ? data?.username : "",
                password: updating ? "pass" : "",
                password_repeat: updating ? "pass" : "",
                email: updating ? data?.email : "",
                profile: {
                    phone_number: updating ? data?.profile?.phone_number : "",
                    county: updating ? data?.profile?.county?.id?.toString() : "",
                    gender: updating ? data?.profile?.gender : "",
                },
                is_active: updating ? data?.is_active : true,
                is_superuser: updating ? data?.is_superuser : false,
            }
        },

        validate: {
            user: {
                first_name: (value) => (value === "" || value === null || value === undefined) ? "First name is required" : null,
                last_name: (value) => (value === "" || value === null || value === undefined) ? "Last name is required" : null,
                email: (value) => (value === "" || value === null || value === undefined) ? "Email is required" : null,
                username: (value) => (value === "" || value === null || value === undefined) ? "Username is required" : null,
                password: (value) => {
                    if (value === "") {
                        return "Password is required"
                    }
                    else if (value !== form.values.user.password_repeat) {
                        return "Passwords do not match"
                    }
                    else {
                        return null
                    }
                },
                password_repeat: (value) => {
                    if (value === "") {
                        return "Repeat Your Password"
                    }
                    else if (value !== form.values.user.password_repeat) {
                        return "Passwords do not match"
                    }
                    else {
                        return null
                    }
                },
            }
        },
    });

    const handleSubmit = () => {
        setLoading(true)
        const data_ = JSON.parse(JSON.stringify(form.values))
        delete data_["password_repeat"];
        data_.user.is_staff = data_.user?.is_superuser

        let METHOD = "POST"
        let URL = API_ENDPOINTS.USERS
        const extra_headers: any = {}

        if (updating) {
            METHOD = "PUT"
            URL = `${URL}/${data?.id}`
            data_.id = data.id
            delete data_.user?.password
            delete data_.user?.password_repeat
            // delete data_.user?.username
            delete data_.user?.email
            extra_headers['Authorization'] = `Bearer ${token}`
        }

        makeRequestOne({ url: `${URL}`, method: METHOD, data: { ...data_.user }, useNext: false, extra_headers }).then((res: any) => {
            showNotification({
                title: "User Account",
                message: updating ? "User account updated successfully" : "Registration successful",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if (!updating) {
                form.reset()
            }
            if (!is_admin) {
                router.push("/auth/login")
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "User Account",
                message: error?.message,
                color: "red",
                icon: <IconAlertTriangle stroke={1.5} />
            })
            const error_data = error?.response?.data
            if (typeof (error_data) === 'object') {
                displayErrors(form, { user: error_data })
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    const loadCoordinates = () => {
        requestGeolocationPermission().then(() => { }).catch(() => { })
        getCoordinates().then((res: any) => {
            form.setFieldValue('latitude', res?.latitude)
            form.setFieldValue('longitude', res?.longitude)
        }).catch((err) => {
            showNotification({
                message: `Unable to load coordinates: ${err}`,
                color: 'red',
                icon: <IconAlertCircle />
            })
        })
    }

    return (
        <Box px='60px' style={theme => ({
            background: isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[2],
            borderRadius: theme.radius.lg
        })}>
            <form onSubmit={form.onSubmit((_values: any) => { handleSubmit() })}>
                <Stack gap={20} py="xl">
                    {
                        !hideTitle ? (
                            <>
                                <Title order={2} fw={500} ta={'center'}>User Account Creation</Title>
                                <Text ta={'center'} c={'dimmed'}>Create a new user account</Text>
                            </>
                        ) : null
                    }
                    <CreateUserFormJustInputs form={form} key={`user`} updating={!!updating}>
                        {/* <CustomCol span={{ md: 6 }}>
                            <SelectCountyInput form={form} field_name={'user.profile.county'} />
                        </CustomCol> */}
                        {is_admin ? (
                            <>
                                <CustomCol span={{ md: 12 }}>
                                    <Title order={3} fw={500}>Admin Information</Title>
                                </CustomCol>
                                <CustomCol span={{ md: 6 }}>
                                    <Stack className='h-100' justify='center'>
                                        <Switch
                                            defaultChecked
                                            label="I am an admin"
                                            {...form.getInputProps('user.is_superuser', { type: 'checkbox' })}
                                        />
                                    </Stack>
                                </CustomCol>
                                <CustomCol span={{ md: 6 }}>
                                    <Stack className='h-100' justify='center'>
                                        <Switch
                                            defaultChecked
                                            label="I am active"
                                            {...form.getInputProps('user.is_active', { type: 'checkbox' })}
                                        />
                                    </Stack>
                                </CustomCol>
                            </>
                        ) :
                            null
                        }

                    </CreateUserFormJustInputs>
                    <Group justify="center" style={{ textAlign: "center" }}>
                        <Button radius={'md'} rightSection={loading ? <Loader color='white' size={16} /> : <IconLogin size={16} />} type='submit' >
                            {
                                updating ? "Update" : "Create Account"
                            }
                        </Button>
                    </Group>
                    <Center >
                        <Anchor component={Link} href={'/auth/login'} size="sm" style={{ fontWeight: 400 }} >Have an account already? Login</Anchor>
                    </Center>
                </Stack>

            </form>
        </Box>
    )
}

export default CreateUserForm