import React, { useEffect, useState } from 'react'
import { RequestProps, makeRequestOne } from '../../config/config'
import { useRouter } from 'next/router'
import { NavLink, useMantineTheme } from '@mantine/core'
import TopicForSidebar from './TopicForSidebar'
import { API_ENDPOINTS } from '@/config/constants'
import { IconLetterT, IconInfoCircle } from '@tabler/icons-react'
import NoDataFound from '../errors/NoDataFound'

interface ILoadTopicSubtopicsForSidebar {
    closeDrawer: any
}

const LoadTopicSubtopicsForSidebar = ({ closeDrawer }: ILoadTopicSubtopicsForSidebar) => {
    const [subtopics, setSubtopics] = useState<any | null>(null)
    const { query } = useRouter();

    const subtopicsReqOptions: RequestProps = {
        method: "GET",
        url: `${API_ENDPOINTS.TOPICS}`,
        params: {
            fields: "id,title,notes,slug,description,course,course_slug,subtopics",
            parent: query?.topicID
        }
    }
    const theme = useMantineTheme()

    const loadSubtopics = () => {
        makeRequestOne(subtopicsReqOptions).then((res: any) => {
            setSubtopics(res?.data?.results)
        }).catch(() => { })
    }

    useEffect(() => {
        loadSubtopics()
    }, [])

    return (
        <div>
            <NavLink label={`${subtopics?.length} Subtopics`} style={{
                borderRadius: theme.radius.md
            }} leftSection={<IconLetterT size="1.2rem" color={theme.colors.pink[6]} />}>
                <NoDataFound visible={subtopics?.length === 0} title='No Subtopics' description='This topic has no subtopics' icon={<IconInfoCircle color='yellow' />} />
                {
                    subtopics?.map((topic: any, i: number) => (
                        <TopicForSidebar key={`subtopic_${i}_nav`} topic={topic} click={closeDrawer} courseSLUG={topic?.course_slug} courseID={topic?.course} />
                    ))}
            </NavLink>
        </div>
    )
}

export default LoadTopicSubtopicsForSidebar