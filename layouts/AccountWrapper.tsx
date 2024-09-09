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
import { IconDashboard, IconSettings, IconLogout, IconHome, IconUserCode } from '@tabler/icons-react';
import UserCard from '@/components/account/UserCard';
import AccountBtn from '@/components/account/AccountBtn';
import { isDarkMode } from '@/config/config';
import { APP_NAME } from '@/config/constants';
import Link from 'next/link';


const ICON_PROPS = {
    stroke: 1.5,
    size: em('22px')
}

const sidebarLinkGroups: SidebarLinkGroupProps[] = [
    {
        id: "application",
        label: "Application",
        links: [
            {
                label: 'Dashboard',
                icon: <IconDashboard  {...ICON_PROPS} />,
                href: '/account'
            },
            // {
            //     label: 'Create Institution',
            //     icon: <IconBuildingBank  {...ICON_PROPS} />,
            //     href: '/account/institutions/create'
            // },
            {
                label: 'Student Profile',
                icon: <IconUserCode  {...ICON_PROPS} />,
                href: '/account/student-profile'
            },
            {
                label: 'Instructor Profile',
                icon: <IconUserCode  {...ICON_PROPS} />,
                href: '/account/instructor-profile'
            },
        ],
    },
]


interface AdminWrapperProps {
    children: React.ReactNode
}

export default function AccountWrapper({ children }: AdminWrapperProps) {
    const { colorScheme } = useMantineColorScheme()
    const [user_, setUser] = useState<any>(null)

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
                                            group.links.map((link, index) => (
                                                <SidebarLink key={`${index}_nav`} {...link} click={closeDrawer} />
                                            ))
                                        }
                                    </Stack>
                                </Box>
                            ))
                        }
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
            <AppShell.Main>
                <div style={{ minHeight: "90vh" }}>
                    <Container size={'xl'} fluid py="lg">
                        <Box p="lg" mih={'100vh'} style={theme => ({
                            background: isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[1],
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