import { Box, Loader, NavLink, Popover, ScrollArea, Text, useMantineTheme } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import TopicForSidebar from './TopicForSidebar'
import { RequestProps, makeRequestOne } from '../../config/config'
import { useRouter } from 'next/router'
import { API_ENDPOINTS } from '@/config/constants'
import { IconClipboardTypography } from '@tabler/icons-react'

interface ITopicsHoverCard {
    closeDrawer: any
    withScrollbar?: boolean
}

const TopicsCard = ({ closeDrawer, withScrollbar }: ITopicsHoverCard) => {
    const [loading, setLoading] = useState(false)
    const [topics, setTopics] = useState<null | any>(null)
    const { query } = useRouter()

    const { radius, colors } = useMantineTheme()

    const courseTopicReqOptions: RequestProps = {
        method: "GET",
        url: `${API_ENDPOINTS.TOPICS}`,
        params: { course__id: query?.id, parent__isnull: true, fields: "id,title,slug,subtopics,course,course_slug" }
    }

    const loadTopics = () => {
        setLoading(true)
        makeRequestOne(courseTopicReqOptions).then((res: any) => {
            setTopics(res?.data.results)
        }).catch(() => { }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        loadTopics()
    }, [])

    return (
        <>
            <ScrollArea h={withScrollbar ? 400 : 'auto'} scrollbarSize={6} color='red'>
                <Box>
                    {loading ? <Loader size="md" variant='bars' /> : null}
                    {
                        topics?.map((topic: any, i: number) => (
                            <TopicForSidebar key={`${i}_nav`} topic={topic} click={closeDrawer} courseSLUG={topic?.course_slug} courseID={topic.course} />
                        )
                        )}
                </Box>
            </ScrollArea>
        </>
    )
}


const TopicsHoverCard = ({ closeDrawer }: ITopicsHoverCard) => {
    const { radius, colors } = useMantineTheme()

    return (
        <>
            <Popover radius={'lg'} width={400} position='top-start' shadow="md" styles={{
                dropdown: {
                    border: `2px solid ${colors.pink[6]}`
                }
            }}>
                <Popover.Target>
                    <NavLink label={'All Topics'} leftSection={<IconClipboardTypography stroke={1.5} />} style={{
                        borderRadius: radius.md,
                    }} />
                </Popover.Target>
                <Popover.Dropdown>
                    <TopicsCard closeDrawer={closeDrawer} withScrollbar={true} />
                </Popover.Dropdown>
            </Popover>
        </>
    )
}

export const TopicsEmbeddableOnSidebar = ({ closeDrawer }: ITopicsHoverCard) => {

    return (
        <>
            <TopicsCard closeDrawer={closeDrawer} withScrollbar={false} />
        </>
    )
}

export default TopicsHoverCard