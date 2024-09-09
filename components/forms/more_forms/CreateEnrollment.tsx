import { makeRequestOne } from "@/config/config";
import { API_ENDPOINTS } from "@/config/constants";
import { displayErrors } from "@/config/functions";
import { useAppContext } from "@/providers/appProvider";
import { Button, Group, Loader, Stack, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconAlertTriangle, IconArticle } from "@tabler/icons-react";
import { useState } from "react";


interface ICreateEnrollment {
    data?: any
    updating?: boolean
    mutate?: any
    label?: string
    buttonLabel?: string
}

const CreateEnrollment = (props: ICreateEnrollment) => {
    const { data, updating, mutate, label, buttonLabel } = props
    const [loading, setLoading] = useState(false)
    const { token } = useAppContext()

    const form = useForm({
        initialValues: {
            is_active: data?.is_active,
        }
    })

    const handleSubmit = () => {
        setLoading(true)
        const data_ = JSON.parse(JSON.stringify(form.values))
        let METHOD = "POST"
        let URL = API_ENDPOINTS.ENROLLMENTS

        if (updating) {
            METHOD = "PATCH"
            URL = `${URL}/${data?.id}`
        }

        makeRequestOne({
            url: `${URL}`, method: METHOD, data: data_, useNext: false, extra_headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                fields: "is_active"
            }
        }).then((res: any) => {
            showNotification({
                title: "Enrollment",
                message: updating ? "Enrollment updated successfully" : "Enrollment creation successfully",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if (!updating) {
                form.reset()
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "Enrollment",
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

    return (
        <div>
            <form onSubmit={form.onSubmit(_ => handleSubmit())}>
                <Stack gap={10}>
                    <TextInput label={"Student"} value={data?.student?.user?.full_name} radius={'md'} disabled placeholder="Student Name" />
                    <Switch label="Is this student enrollment active?" {...form.getInputProps('is_active', {type: 'checkbox'})} />
                    <Group justify="center" style={{ textAlign: "center" }}>
                        <Button radius={'md'} loading={loading} type='submit' >
                            {updating ? "Update" : buttonLabel ?? "Create"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </div>
    )
}

export default CreateEnrollment