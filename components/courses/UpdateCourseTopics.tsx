import { Stack, Box, Title, Button, Text, Group } from "@mantine/core"
import { useForm } from "@mantine/form"
import SingleTopicForm from "./SingleTopicForm"
import { RequestProps, makeRequestOne } from "@/config/config"
import { API_ENDPOINTS, EMOJIS } from "@/config/constants"
import { displayErrors } from "@/config/functions"
import { showNotification } from "@mantine/notifications"
import { IconAlertCircle, IconAlertTriangle } from "@tabler/icons-react"
import { useAppContext } from "@/providers/appProvider"
import { useState } from "react"
import { useRouter } from "next/router"

function enrichSubtopics(subtopics: any, courseId: any, createdBy: any) {
    return subtopics.map((subtopic: any) => ({
        ...subtopic,
        course: courseId,
        created_by: createdBy,
        // Check if there are further subtopics and process them recursively
        subtopics: subtopic.subtopics ? enrichSubtopics(subtopic.subtopics, courseId, createdBy) : []
    }));
}

function enrichTopics(data: any, courseId: any, userId: any) {
    return data?.topics.map((topic: any) => ({
        ...topic,
        course: courseId,
        created_by: topic?.created_by ?? userId,
        subtopics: enrichSubtopics(topic?.subtopics ?? [], courseId, topic?.created_by ?? userId)
    }));
}

const topicInfo = {
    id: null,
    period: 0,
    title: "",
    description: "",
    order: 0,
    notes: "",
    subtopics: []
}


interface IUpdateCourseTopics {
    course: any
}

const UpdateCourseTopics = ({ course }: IUpdateCourseTopics) => {
    const [loading, setLoading] = useState(false)
    const { token, user_id } = useAppContext()
    const router = useRouter()

    const form = useForm({
        initialValues: course
    })


    const handleSubmit = () => {
        console.log(course)
        let data: any = structuredClone(form.values)
        let topics = enrichTopics(data, course.id, user_id);
        console.log(topics)
        data = {
            ...data,
            topics,
        }
        let requestOptions: RequestProps = {
            url: `${API_ENDPOINTS.COURSE_CREATE_UPDATE}/${course.id}`,
            method: 'PUT',
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            data: {
                ...data
            },
            params: {
                fields: 'id,title,slug,subtopics,period,order,description,topics,course,parent'
            },
            useNext: false
        }
        setLoading(true)
        makeRequestOne(requestOptions).then(res => {
            showNotification({
                title: `Success ${EMOJIS.smiley}`,
                message: "Course topics updated successfully",
                color: 'green',
                icon: <IconAlertCircle stroke={1.5} />,
            })
            // form.reset()
            router.reload()
        }).catch(error => {
            const errors = error?.response?.data
            displayErrors(form, errors)
            showNotification({ 
                title: 'Error',
                message: "Something went wrong!",
                color: 'red',
                icon: <IconAlertTriangle stroke={1.5} />,
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const addTopic = () => {
        form.insertListItem('topics', topicInfo)
    }

    return (
        <div>
            <Stack>
                <Group justify="end">
                    <Button variant='light' radius={'md'} onClick={addTopic}>Add Topic</Button>
                </Group>
                <form onSubmit={form.onSubmit((_) => handleSubmit())}>
                    <Stack>
                        {
                            form.values?.topics?.map((topic: any, i: number) => <SingleTopicForm key={`topic_${i}`} form={form} path={`topics.${i}`} topic={topic} />)
                        }
                        <Group justify="end">
                            <Button variant='light' radius={'md'} onClick={addTopic}>Add Topic</Button>
                        </Group>
                        <Group>
                            <Button loading={loading} variant='light' radius={'md'} type="submit">Update Topics</Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </div>
    )
}

export default UpdateCourseTopics