import { isDarkMode } from '@/config/config'
import { Avatar, Card, Grid, Image, Stack, Text, Title, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import React from 'react'

const QuickCard = (props: any) => {
    const { title, text, image } = props
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()

    return (
        <Card radius="lg" h={'100%'} mx={0} style={{
            background: isDarkMode(colorScheme) ? theme.colors.dark[7] : theme.colors.gray[0]
        }}>
            <Stack gap={10} align='center'>
                <Image fit='contain' mah={'150px'} src={image} />
                <Title order={2} ta='center'>
                    {title}
                </Title>
                <Text ta='center' maw={'80%'}>
                    {text}
                </Text>
            </Stack>
        </Card>
    )
}

const HeroQuickCards = () => {
    return (
        <Grid px={0}>
            <Grid.Col span={{ md: 4, sm: 6 }}>
                <QuickCard title="Ultimate Learning Solution" text="Smooth Experience, Vast Course Library, Personalized Learning." image="/static/images/hero/2.png" />
            </Grid.Col>
            <Grid.Col span={{ md: 4, sm: 6 }}>
                <QuickCard title="Enriched Learning Experience" text="Interactive Tools, Engaging Content, Adaptive Assessments." image="/static/images/hero/1.png" />
            </Grid.Col>
            <Grid.Col span={{ md: 4, sm: 6 }}>
                <QuickCard title="Empower Your Education Journey" text="Flexible Options, Expert Instructors, Skill-Based Curriculum." image="/static/images/hero/3.png" />
            </Grid.Col>
        </Grid>
    )
}

export default HeroQuickCards