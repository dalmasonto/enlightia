import { useEffect, useState } from 'react';
import {
    AppShell,
    Text,
    Burger,
    useMantineTheme,
    Group,
    Box,
    ScrollArea,
    Stack,
    NavLink,
    useMantineColorScheme,
    Title,
    Container,
    em,
    Anchor,
} from '@mantine/core';
import ColorSchemeToggle from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import SidebarLink, { SidebarLinkGroupProps } from '@/components/navigations/SidebarLink';
import { useAppContext } from '@/providers/appProvider';
import { useMediaQuery } from '@mantine/hooks';
import { IconSettings, IconLogout, IconHome, IconBook, IconClipboardCheck, IconClipboardText, IconClipboardTypography, IconClipboard, IconBrandWechat, IconInfoCircle, IconNotes } from '@tabler/icons-react';
import UserCard from '@/components/account/UserCard';
import AccountBtn from '@/components/account/AccountBtn';
import { isDarkMode } from '@/config/config';
import { APP_NAME } from '@/config/constants';
import { TopicsEmbeddableOnSidebar } from '@/components/courses/TopicsHoverCard';
import { useRouter } from 'next/router';
import CompleteTopicButton from '@/components/courses/topics/CompleteTopicButton';
import Link from 'next/link';


const ICON_PROPS = {
    stroke: 1.5,
    size: em('22px')
}

const sidebarLinkGroups: SidebarLinkGroupProps[] = [
    {
        id: "main",
        label: "Main",
        links: [
            {
                label: 'About',
                icon: <IconInfoCircle  {...ICON_PROPS} />,
                href: '/'
            },
            {
                label: 'Resources',
                icon: <IconBook  {...ICON_PROPS} />,
                href: '/resources'
            },
            {
                label: 'Tests',
                icon: <IconClipboardCheck  {...ICON_PROPS} />,
                href: '/tests'
            },
            {
                label: 'Exams',
                icon: <IconClipboardText  {...ICON_PROPS} />,
                href: '/exams'
            },
        ],
    },
]


interface AdminWrapperProps {
    children: React.ReactNode
}

export default function CourseWrapper({ children }: AdminWrapperProps) {
    const { colorScheme } = useMantineColorScheme()
    const [user_, setUser] = useState<any>(null)

    const { query } = useRouter()
    const COURSE_BASE_URL = `/courses/${query.id}/${query.slug}`
    const TOPIC_BASE_URL = `/courses/${query.id}/${query.slug}/topics/${query?.topicID}/${query.topicSLUG}`

    const { logout, user } = useAppContext()
    const [opened, setOpened] = useState(false);
    const closeDrawer = () => setOpened((o) => !o)

    const theme = useMantineTheme();
    const matches = useMediaQuery('(max-width: 992px)');

    useEffect(() => {
        setUser(user)
    }, [])

    return (
        <AppShell
            styles={(theme) => ({
                main: {
                    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : "#95b6ff33",
                    // overflow: "hidden",
                    transition: "color background-color 1s cubic-bezier(0.42, 0, 1, 1)",
                },
            })}
            navbar={{
                breakpoint: 'sm',
                width: { sm: 200, lg: 400 },
                collapsed: { desktop: false, mobile: !opened }
            }}
            aside={{
                breakpoint: 'sm',
                width: { sm: 200, lg: 300 },
                collapsed: { desktop: (!query?.topicID || !query?.topicSLUG) }
            }}
            header={{
                height: { base: 60, md: 70 }
            }}
        >
            <AppShell.Header>
                <Container size={'xxl'} className='h-100'>
                    <Group justify='space-between' className='h-100' align='center'>
                        <Group className='h-100' align='center'>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                                hiddenFrom='sm'
                            />
                            <Anchor component={Link} href={'/'}>
                                <Title order={2} fw={500}>{APP_NAME}</Title>
                            </Anchor>
                        </Group>
                        <Group gap={'sm'}>
                            <AccountBtn />
                            <ColorSchemeToggle />
                        </Group>
                    </Group>
                </Container>
            </AppShell.Header>
            <AppShell.Navbar>
                <AppShell.Section px="xs">
                    {
                        sidebarLinkGroups.map((group: SidebarLinkGroupProps, i: number) => (
                            <Box key={`group_${group.id}`} mb={10}>
                                <Text mb={6} fw={600}>{group.label}</Text>
                                <Stack gap={2}>
                                    {
                                        group.links.map((link, index) => (
                                            <SidebarLink key={`${index}_nav`} {...link} href={`${COURSE_BASE_URL}${link.href}`} click={closeDrawer} />
                                        ))
                                    }
                                </Stack>
                            </Box>
                        ))
                    }
                    <NavLink label={'All Topics'} leftSection={<IconClipboardTypography stroke={1.5} />} style={{
                        borderRadius: theme.radius.md,
                    }} />
                </AppShell.Section>
                <AppShell.Section grow component={ScrollArea} scrollbarSize={10} px="sm" pb="lg" pt="0"
                    bg={isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[1]}>
                    <Stack gap={0}>
                        {/* <TopicsHoverCard closeDrawer={closeDrawer} /> */}
                        <TopicsEmbeddableOnSidebar closeDrawer={closeDrawer} />
                    </Stack>
                </AppShell.Section>
                <AppShell.Section py="xs">
                    <Stack justify="flex-end" gap={4} px={'sm'}>
                        <SidebarLink icon={<IconHome {...ICON_PROPS} />} label={'Go Home'} href={'/'} click={closeDrawer} />
                        <SidebarLink icon={<IconSettings {...ICON_PROPS} />} label={'Profile Settings'} href={'/account/settings'} click={closeDrawer} />
                        <NavLink fw={600} h={'52px'} rightSection={<IconLogout />} label={'Logout'} onClick={() => {
                            closeDrawer()
                            logout()
                        }} style={theme => ({
                            borderRadius: theme.radius.md,
                            background: theme.colors.dark[8],
                            color: theme.colors.gray[2],
                            // fontSize: '42px'
                        })} />
                    </Stack>
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Aside p={'xs'}>
                <Stack>
                    <Title order={3} fw={500} ta={'center'}>About Topic</Title>
                    <UserCard />
                    <Box>
                        <Box mb={'lg'}>
                            <CompleteTopicButton />
                        </Box>
                        <SidebarLink click={closeDrawer} label={'Notes'} icon={<IconNotes {...ICON_PROPS} />} href={`${TOPIC_BASE_URL}/`} />
                        <SidebarLink click={closeDrawer} label={'Tests'} icon={<IconClipboardCheck {...ICON_PROPS} />} href={`${TOPIC_BASE_URL}/tests`} />
                        <SidebarLink click={closeDrawer} label={'Assignments'} icon={<IconClipboard {...ICON_PROPS} />} href={`${TOPIC_BASE_URL}/assignments`} />
                        <SidebarLink click={closeDrawer} label={'Chat'} icon={<IconBrandWechat {...ICON_PROPS} />} href={`${TOPIC_BASE_URL}/chat`} />
                    </Box>
                </Stack>
            </AppShell.Aside>
            <AppShell.Main>
                <div style={{ minHeight: "90vh" }}>
                    <Container size={'xxl'} py="lg">
                        <Box p="lg" style={theme => ({
                            // background: isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[0],
                            borderRadius: theme.radius.lg
                        })}>
                            {children}
                        </Box>
                    </Container>
                </div>
            </AppShell.Main>
        </AppShell>
    );
}