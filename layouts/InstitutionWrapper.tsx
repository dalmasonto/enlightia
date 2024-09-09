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
import { IconDashboard, IconSettings, IconLogout, IconHome, IconNotebook, IconReport, IconUserShare, IconUserDollar, IconUserPlus, IconPlus, IconBuildingBank, IconArticle, IconHome2, IconMessage, IconPhoto, IconUserCheck, IconUsers, IconInfoCircle, IconMessageCircle2, IconMessagePlus, IconMessageCirclePlus, IconListLetters, IconPlaylistAdd, IconListTree, IconClipboardList, IconClipboardPlus, IconBookmarks, IconClipboardCheck, IconLibrary, IconUsersGroup } from '@tabler/icons-react';
import UserCard from '@/components/account/UserCard';
import AccountBtn from '@/components/account/AccountBtn';
import { isDarkMode } from '@/config/config';
import { useRouter } from 'next/router';
import Media from '@/components/media/Media';
import { modals } from '@mantine/modals';
import { APP_NAME } from '@/config/constants';
import Link from 'next/link';


const ICON_PROPS = {
    stroke: 1.5,
    size: em('22px')
}

const sidebarLinkGroups: any = [
    {
        id: "application",
        label: "Menu",
        links: [
            {
                label: 'Dashboard',
                icon: <IconDashboard stroke={1.5} />,
                href: ""
            },
            {
                label: 'Contact Forms',
                icon: <IconMessage stroke={1.5} />,
                href: `/contact`
            },
            {
                label: 'Admins',
                icon: <IconUserCheck stroke={1.5} />,
                href: `/users/admins`
            },
            {
                label: 'Instructors',
                icon: <IconUsers stroke={1.5} />,
                href: `/users/instructors`
            },
            {
                label: 'Students',
                icon: <IconUsersGroup stroke={1.5} />,
                href: `/users/students`
            },
            {
                label: 'Courses',
                icon: <IconArticle stroke={1.5} />,
                href: `/courses`
            },
            {
                label: 'Add Course',
                icon: <IconPlus stroke={1.5} />,
                href: `/courses/add`
            },
        ],
    },
    // {
    //     id: "users",
    //     label: "Users",
    //     links: [
    //         {
    //             label: 'Admins',
    //             icon: <IconUserCheck stroke={1.5} />,
    //             href: `/users/admins`
    //         },
    //         {
    //             label: 'Instructors',
    //             icon: <IconUsers stroke={1.5} />,
    //             href: `/users/instructors`
    //         },
    //     ],
    // },
    // {
    //     id: "courses",
    //     label: "Courses",
    //     links: [
    //         {
    //             label: 'All Courses',
    //             icon: <IconArticle stroke={1.5} />,
    //             href: `/courses`
    //         },
    //         {
    //             label: 'Add New',
    //             icon: <IconPlus stroke={1.5} />,
    //             href: `/courses/add`
    //         },
    //     ],
    // },
    // {
    //     id: "media",
    //     label: "Media",
    //     links: [
    //         {
    //             label: 'Assets',
    //             icon: <IconPhoto stroke={1.5} />,
    //             href: `/media/`
    //         },
    //     ]
    // }
]

const courseAsideLinkGroups: any = [
    {
        id: "course-aside",
        label: "Course",
        links: [
            {
                label: 'Course Info',
                icon: <IconInfoCircle stroke={1.5} />,
                href: "/"
            },
            {
                label: 'Students',
                icon: <IconUsersGroup stroke={1.5} />,
                href: "/students"
            },
            {
                label: 'Topics',
                icon: <IconListLetters stroke={1.5} />,
                href: `/topics`
            },
            {
                label: 'Topics(Update)',
                icon: <IconListTree stroke={1.5} />,
                href: `/topics/with-subtopics`
            },
            {
                label: 'Add Topic',
                icon: <IconPlaylistAdd stroke={1.5} />,
                href: `/topics/add`
            },
            {
                label: 'Cohorts',
                icon: <IconBookmarks stroke={1.5} />,
                href: `/cohorts`
            },
            {
                label: 'Add Cohort',
                icon: <IconPlus stroke={1.5} />,
                href: `/cohorts/add`
            },
            {
                label: 'Tests',
                icon: <IconClipboardList stroke={1.5} />,
                href: `/tests`
            },
            {
                label: 'Add Test',
                icon: <IconClipboardPlus stroke={1.5} />,
                href: `/tests/add`
            },
            {
                label: 'Test Submissions',
                icon: <IconClipboardCheck stroke={1.5} />,
                href: `/tests/submissions`
            },
        ],
    },
]



interface AdminWrapperProps {
    children: React.ReactNode
}

export default function InstitutionWrapper({ children }: AdminWrapperProps) {
    const { colorScheme } = useMantineColorScheme()
    const [user_, setUser] = useState<any>(null)

    const { query } = useRouter()
    const BASE_URL = `/institution/admin/${query.id}/${query.slug}`
    const COURSE_BASE_URL = `/institution/admin/${query.id}/${query.slug}/courses/${query?.cid}/${query.cslug}`


    const { logout, user } = useAppContext()
    const [opened, setOpened] = useState(false);
    const closeDrawer = () => setOpened((o) => !o)

    const theme = useMantineTheme();
    const matches = useMediaQuery('(max-width: 992px)');

    const openMedia = () => {
        return modals.open({
            title: 'Media',
            radius: 'md',
            size: 'xl',
            children: (
                <Box w={'100%'}>
                    <Media />
                </Box>
            )
        })
    }

    useEffect(() => {
        setUser(user)
    }, [])

    return (
        <AppShell
            styles={(theme) => ({
                main: {
                    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                    overflow: "hidden",
                    transition: "color background-color 1s cubic-bezier(0.42, 0, 1, 1)",
                },
            })}
            navbar={{
                breakpoint: 'sm',
                width: { sm: 200, lg: 300 }
            }}
            header={{
                height: { base: 60, md: 70 }
            }}
            aside={{
                breakpoint: 'sm',
                width: { sm: 200, lg: 400, md: 300 },
                collapsed: { desktop: (!query?.cid || !query?.cslug) }
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
                <AppShell.Section p="xs">
                    <UserCard />
                </AppShell.Section>
                <AppShell.Section grow component={ScrollArea} scrollbarSize={10} px="sm" pb="lg" pt="xs">
                    <Stack>
                        {
                            sidebarLinkGroups.map((group: SidebarLinkGroupProps, i: number) => (
                                <Box key={`group_${group.id}`} mb={10}>
                                    <Text mb={6} fw={600}>{group.label}</Text>
                                    <Stack gap={2}>
                                        {
                                            group?.links?.map((link, index) => (
                                                <SidebarLink key={`${index}_nav`} {...link} href={`${BASE_URL}${link.href}`} click={closeDrawer} />
                                            ))
                                        }
                                    </Stack>
                                </Box>
                            ))
                        }
                    </Stack>
                    <SidebarLink icon={<IconLibrary {...ICON_PROPS} />} label={'Media'} href={'#'} click={openMedia} />
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
            <AppShell.Aside>
                <AppShell.Section p="xs">
                    <Stack>
                        {
                            courseAsideLinkGroups.map((group: SidebarLinkGroupProps, i: number) => (
                                <Box key={`group_${group.id}`} mb={10}>
                                    <Text mb={6} fw={600}>{group.label}</Text>
                                    <Stack gap={2}>
                                        {
                                            group?.links?.map((link, index) => (
                                                <SidebarLink key={`${index}_nav`} {...link} href={`${COURSE_BASE_URL}${link.href}`} click={closeDrawer} />
                                            ))
                                        }
                                    </Stack>
                                </Box>
                            ))
                        }
                    </Stack>
                </AppShell.Section>
            </AppShell.Aside>
            <AppShell.Main>
                <div style={{ minHeight: "90vh" }}>
                    <Container size={'xl'} fluid py="lg">
                        <Box p="lg" style={theme => ({
                            background: isDarkMode(colorScheme) ? theme.colors.dark[6] : theme.colors.gray[2],
                            borderRadius: theme.radius.lg
                        })}>
                            {children}
                        </Box>
                    </Container>
                </div>
            </AppShell.Main>
        </AppShell >
    );
}