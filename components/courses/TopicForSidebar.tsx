import { useMantineTheme, NavLink } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import { matchTest } from "../../config/config"
import { IconClipboardTypography } from "@tabler/icons-react"

interface TopicForSidebarProps {
    topic: any,
    click: any,
    courseID: any,
    courseSLUG: any,
    icon?: any
}


export const SingleSidebarTopic = (props: any) => {
    const { topicURL, label, period, description, click, icon } = props
    const router = useRouter()
    const theme = useMantineTheme()

    const match = () => {
        const path = router.asPath
        return matchTest(path, topicURL)
    }

    return (
        <NavLink mb={2} component={Link}
            href={topicURL} active={match()}
            leftSection={icon ? icon : <IconClipboardTypography />}
            label={`${label}`}
            onClick={click}
            fw={500}
            style={{
                borderRadius: theme.radius.md,
                fontSize: "12px"
            }} />
    )
}

const TopicForSidebar = (props: TopicForSidebarProps) => {
    const { topic, click, courseID, courseSLUG } = props
    const theme = useMantineTheme()
    const topicURL = `/courses/${courseID}/${courseSLUG}/topics/${topic?.id}/${topic?.slug}/`

    return (
        <>
            {
                topic?.subtopics?.length === 0 ? (
                    <SingleSidebarTopic topicURL={topicURL} label={`${topic?.title}`}
                        click={click} />
                ) : (
                    <NavLink
                        label={`${topic?.title}`}
                        defaultOpened
                        fw={500}
                        style={{
                            borderRadius: theme.radius.md
                        }}>
                        <SingleSidebarTopic topicURL={topicURL} label={`Go To Topic`}
                            click={click} />
                        {
                            topic?.subtopics?.map((subtopic: any, i: any) => (
                                <TopicForSidebar key={`${topic?.id}_${subtopic?.id}`}
                                    topic={subtopic}
                                    click={click}
                                    courseSLUG={courseSLUG}
                                    courseID={courseID} />
                            ))
                        }
                    </NavLink>

                )
            }
        </>
    )
}

export default TopicForSidebar