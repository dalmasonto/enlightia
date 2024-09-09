import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS, EMOJIS, ERRORS } from '@/config/constants'
import { useAppContext } from '@/providers/appProvider'
import { Alert, Button, Loader, Stack, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const CompleteTopicButton = () => {

    const [hasCompletedTopic, setHasCompletedTopic] = useState(false)
    const [loading, setLoading] = useState(false)
    const { user, token } = useAppContext()

    const { query } = useRouter()

    const checkHasCompletedTopic = () => {
        makeRequestOne({
            url: API_ENDPOINTS.COMPLETED_TOPICS,
            method: "GET",
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            params: { student__id: user?.student ?? 0, topic__id: query?.topicID },
            useNext: false
        }).then((res: any) => {
            const count = res?.data?.count
            if (count > 0) {
                setHasCompletedTopic(true)
            }
            else {
                setHasCompletedTopic(false)
            }
        }).catch((error) => { })
    }

    const markTopicAsCompleted = () => {
        if (user?.student === null) {
            showNotification({
                title: "Error!",
                message: <Text>
                    You need a student profile. Go to your account under <Link href={`/account/student-profile`}>student profile tab</Link> to register your student account
                </Text>,
                color: "red"
            })
            return;
        }
        setLoading(true)
        makeRequestOne({
            url: API_ENDPOINTS.COMPLETED_TOPICS,
            method: "POST",
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            data: {
                created_by: user?.id,
                topic: query.topicID,
                email: user?.email,
                student: user?.student
            },
            params: {
                fields: "id,created_by,topic,email,student",
            },
            useNext: false
        }).then((res: any) => {
            setHasCompletedTopic(true)
            showNotification({
                title: `Congratulations! ${EMOJIS.partypopper}${EMOJIS.partypopper}`,
                message: "You have successfully completed this topic. Please proceed below to do any tests before you move to next topic.",
                color: "green"
            })
        }).catch((error) => {
            if (error?.response?.data?.non_field_errors[0] === ERRORS.COMPLETED_TOPIC_ERROR) {
                setHasCompletedTopic(true)
            } else {
                showNotification({
                    title: "Error!",
                    message: "Could not mark the topic as completed",
                    color: "red"
                })
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        checkHasCompletedTopic()
    }, [query?.topicID, query?.topicSlug])

    return (
        <Stack>
            {/* <Text>Have complete the Topic?</Text> */}
            {
                hasCompletedTopic ? (
                    <Alert ta={'center'} radius={'md'} color='green'>
                        <Text size='sm'>
                            {`Congratulations! ${EMOJIS.partypopper.repeat(2)}`}
                        </Text>
                        <Text size='sm'>
                            You have completed this topic!
                        </Text>

                    </Alert>
                ) : (
                    <Button fullWidth disabled={hasCompletedTopic} radius="md" variant='filled' onClick={markTopicAsCompleted} size='md' rightSection={loading ? <Loader size="sm" color='white' /> : <IconCheck />}>
                        {
                            hasCompletedTopic ? "Already completed" : "Mark as Complete"
                        }
                    </Button>
                )
            }
        </Stack>
    )
}

export default CompleteTopicButton