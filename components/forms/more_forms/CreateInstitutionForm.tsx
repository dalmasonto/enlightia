
import { makeRequestOne } from "@/config/config";
import { API_ENDPOINTS } from "@/config/constants";
import { displayErrors } from "@/config/functions";
import { useAppContext } from "@/providers/appProvider";
import { Button, FileInput, Group, Loader, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconAlertTriangle, IconLogin } from "@tabler/icons-react";
import { useState } from "react";


interface ICreateInstitutionForm {
    data?: any
    updating?: boolean
    mutate?: any
}

const CreateInstitutionForm = (props: ICreateInstitutionForm) => {
    const { data, updating, mutate } = props
    const [loading, setLoading] = useState(false)
    const { token, user_id } = useAppContext()

    const form = useForm({
        initialValues: {
            name: updating ? data?.name : "",
            logo: null,
            banner: null,
        },
        validate: {
            name: val => val === "" ? "Institution name is required" : null,
        }
    })

    const handleSubmit = () => {
        setLoading(true)
        const data_: any = form.values
        let METHOD = "POST"
        let URL = API_ENDPOINTS.INSTITUTIONS
 
        if (updating) {
            METHOD = "PUT"
            URL = `${URL}/${data?.id}`
        }else{
            data_.created_by = user_id
        }

        const formData = new FormData()

        Object.keys(data_).map((item_key: string) => {
            if (item_key === 'logo' || item_key === 'banner') {
                if (form?.values[item_key]) {
                    const val: any = form?.values[item_key]
                    formData.append(item_key, val)
                }
            } else {
                formData.append(item_key, data_[item_key])
            }
        })

        makeRequestOne({
            url: `${URL}`, method: METHOD, data: formData, useNext: false, extra_headers: {
                Authorization: `Bearer ${token}`,
                // 'content-type': 'Multipart/form-data'
            }
        }).then((res: any) => {
            showNotification({
                title: "Institution",
                message: updating ? "Institution updated successfully" : "Institution creation successfully",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            if (!updating) {
                form.reset()
            }
            mutate && mutate()
        }).catch(error => {
            showNotification({
                title: "Institution",
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
                    <TextInput required label="Institution Name" placeholder='Enter the name of the institution' {...form.getInputProps('name')} />
                    <FileInput accept="image/*" label="Institution Logo" placeholder='Enter logo URL' {...form.getInputProps('logo')} />
                    <FileInput accept="image/*" label="Institution Banner" placeholder='Enter banner URL' {...form.getInputProps('banner')} />
                    <Group justify="center" style={{ textAlign: "center" }}>
                        <Button radius={'md'} rightSection={loading ? <Loader color='white' size={16} /> : <IconLogin size={16} />} type='submit' >
                            {updating ? "Update" : "Create"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </div>
    )
}

export default CreateInstitutionForm