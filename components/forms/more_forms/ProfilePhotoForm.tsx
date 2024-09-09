import CustomCol from "@/components/common/CustomCol";
import { makeRequestOne } from "@/config/config";
import { API_ENDPOINTS } from "@/config/constants";
import { displayErrors, loadMediaURL } from "@/config/functions";
import { useAppContext } from "@/providers/appProvider";
import { Avatar, Button, FileInput, Grid, Group, Loader, Select, Stack, Switch, Text, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconAlertTriangle, IconLogin } from "@tabler/icons-react";
import { useState } from "react";


interface IProfilePhotoForm {
    data?: any
    updating?: boolean
    mutate?: any
}

const ProfilePhotoForm = (props: IProfilePhotoForm) => {
    const { data, updating, mutate } = props
    const [loading, setLoading] = useState(false)
    const { token, user, user_id } = useAppContext()

    const form = useForm({
        initialValues: {
            avatar: "",
        },
        validate: {
            avatar: val => val === '' ? 'Profile photo is required' : null
        }
    })

    const handleSubmit = () => {
        setLoading(true)
        const data_ = {
            user: user_id,
            avatar: form.values.avatar,
        }
        if (user?.profile) {
            let METHOD = "PUT"
            let URL = `${API_ENDPOINTS.PROFILES}/${user?.profile?.id}`
            makeRequestOne({
                url: `${URL}`, method: METHOD, data: data_, useNext: false, extra_headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                params: {
                    fields: 'avatar'
                }
            }).then((res: any) => {
                showNotification({
                    title: "Profile Photo",
                    message: "Profile Photo changed successfully!",
                    color: "green",
                    icon: <IconAlertCircle stroke={1.5} />
                })
                if (!updating) {
                    form.reset()
                }
                mutate && mutate()
            }).catch(error => {
                showNotification({
                    title: "Profile Photo",
                    message: error?.message,
                    color: "red",
                    icon: <IconAlertTriangle stroke={1.5} />
                })
                const error_data = error?.response?.data
                if (typeof (error_data) === 'object') {
                    displayErrors(form, error_data)
                }
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    return (
        <div>
            <form onSubmit={form.onSubmit(_ => handleSubmit())}>
                <Stack gap={10}>
                    <Grid>
                        <Grid.Col span={{ md: 6 }}>
                            <Stack align="center" justify="center">
                                <Text ta={'center'}>Current</Text>
                                <Avatar size={'120px'} src={loadMediaURL(user?.profile?.avatar ?? "")} />
                            </Stack>
                        </Grid.Col>
                        <Grid.Col span={{ md: 6 }}>
                            <Stack className="h-100" justify="center">
                                <FileInput
                                    label="Select Profile Photo"
                                    placeholder='Avatar'
                                    accept="img/*"
                                    radius="md"
                                    {...form.getInputProps('avatar')}
                                    withAsterisk
                                />
                            </Stack>
                        </Grid.Col>
                    </Grid>
                    <Group justify="center" style={{ textAlign: "center" }}>
                        <Button radius={'md'} rightSection={loading ? <Loader color='white' size={16} /> : <IconLogin size={16} />} type='submit' >
                            Update
                        </Button>
                    </Group>
                </Stack>
            </form>
        </div>
    )
}

export default ProfilePhotoForm