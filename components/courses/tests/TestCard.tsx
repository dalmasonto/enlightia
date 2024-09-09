import { isDarkMode } from "@/config/config"
import { Card, Stack, Group, Title, ActionIcon, Anchor, Button, Text, useMantineTheme, useMantineColorScheme } from "@mantine/core"
import { IconClipboardTypography, IconClock } from "@tabler/icons-react"
import Link from "next/link"

export interface ITestCard {
    test: any
    hasCompletedTopic?: boolean
    testURL: string
    hideStartTestButton?: boolean
}

export const TestCard = ({ test, hasCompletedTopic, testURL, hideStartTestButton }: ITestCard) => {
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()

    return (
        <Card radius="md" className="h-100" bg={isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[0]} shadow="">
            <Stack gap={10}>
                <Group justify='space-between'>
                    <Title order={4} fw={600} size={16}>{test?.title}</Title>
                    <Button size={"xs"} variant="light" radius={'xl'} fw={500} style={{ pointerEvents: "none" }}>
                        {`${test?.question_count} Questions`}
                    </Button>
                </Group>
                <Text size={"sm"} c='dimmed' lineClamp={1}>{test?.description}</Text>
                <Title order={6} size={14}>Tested Topic(s)</Title>
                {
                    test?.topics?.map((topic: any, i: number) => (
                        <Group key={`test_topic_${topic.id}`} gap={10}>
                            <ActionIcon variant="light" size={'sm'} radius={'md'}>
                                <IconClipboardTypography size={'18px'} stroke={'1.5px'} />
                            </ActionIcon>
                            <Text size="sm" fw={500}>{topic?.title}</Text>
                        </Group>
                    ))
                }
                {
                    !hideStartTestButton ? (
                        <>
                            {
                                hasCompletedTopic ? (
                                    <Anchor ml={'auto'} component={Link} href={testURL}>
                                        <Button leftSection={<IconClock />} size='xs' variant='outline' radius="md">Start</Button>
                                    </Anchor>
                                ) : <Text size="sm" color='red'>Complete the associated topic first before attempting this test</Text>
                            }
                        </>
                    ) : null
                }
            </Stack>
        </Card>
    )
}

export default TestCard