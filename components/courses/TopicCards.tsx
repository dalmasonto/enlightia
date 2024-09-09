import { isDarkMode } from "@/config/config"
import { useMantineTheme, Anchor, Paper, Title, Stack, NavLink, useMantineColorScheme } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/router"


export const SingleTopicCard = (props: any) => {
    const { topic, index } = props
    const theme = useMantineTheme()
    const {colorScheme} = useMantineColorScheme()
    const { query } = useRouter()
    const { id, slug, cid, cslug } = query

    const topicLink = `/institution/admin/${id}/${slug}/courses/${cid}/${cslug}/topics/${topic.id}/${topic.slug}/`

    return (
        <Anchor component={Link} href={topicLink}>
            <Paper radius="md" p="md" style={{
                background: isDarkMode(colorScheme) ? theme.colors.dark[5] : theme.colors.gray[1],
                height: "100%"
            }}>
                <Title fw={500} size={16}>
                    {`${index ?? '-'}. ${topic?.title}`}
                </Title>
            </Paper>
        </Anchor>
    )
}

export const RenderTopic = (props: any) => {
    const { topic, order } = props

    const { query } = useRouter()
    const { id, slug, cid, cslug } = query

    const topicLink = `/institution/admin/${id}/${slug}/courses/${cid}/${cslug}/topics/${topic.id}/${topic.slug}/`

    return (
        <div>
            <Stack>
                <NavLink defaultOpened={true} label={<Title order={order > 6 ? 6 : order} size={22} fw={400}>{topic?.title}</Title>}>
                    <NavLink component={Link} href={topicLink} label={"Go To Topic"} leftSection={<IconChevronRight />} />
                    {
                        topic?.subtopics?.map((topic: any, i: any) => {
                            if (topic?.subtopics?.length > 0) {
                                return (
                                    <RenderTopic key={`topic_${topic.id}`} order={order + 1} topic={topic} />
                                )
                            } else {
                                let topicUrl = `/institution/admin/${id}/${slug}/courses/${cid}/${cslug}/topics/${topic.id}/${topic.slug}/`
                                return (
                                    <NavLink key={`topic_${topic.id}`} label={topic?.title} component={Link} href={topicUrl} leftSection={<IconChevronRight />} />
                                )
                            }
                        })
                    }
                </NavLink>
            </Stack>
        </div>
    )
}