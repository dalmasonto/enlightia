import { useState } from 'react';
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
import { IconDashboard, IconSettings, IconLogout, IconHome, IconForms, IconUsersGroup, IconReceipt, IconUpload, IconUserStar, IconStar, IconCategory, IconQuestionMark, IconArticle, IconLibrary, IconBuildingStore, IconShoppingBag } from '@tabler/icons-react';
import UserCard from '@/components/account/UserCard';
import AccountBtn from '@/components/account/AccountBtn';
import { isDarkMode } from '@/config/config';
import { modals } from '@mantine/modals';
import Media from '@/components/media/Media';
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
                href: '/admin'
            },
            {
                label: 'Inquiries/Contact Form',
                icon: <IconForms {...ICON_PROPS} />,
                href: '/admin/more/contact-form'
            },
        ],
    },
    {
        id: "users",
        label: "Users",
        links: [
            {
                label: 'All Users',
                icon: <IconUsersGroup {...ICON_PROPS} />,
                href: '/admin/users'
            },
            {
                label: 'Merchants',
                icon: <IconBuildingStore {...ICON_PROPS} />,
                href: '/admin/users/merchants'
            },
            {
                label: 'Upload Merchants',
                icon: <IconUpload {...ICON_PROPS} />,
                href: '/admin/users/merchants/upload'
            },
        ],
    },
    {
        id: "more",
        label: "More",
        links: [
            // {
            //     label: 'Counties',
            //     icon: <IconLocation {...ICON_PROPS} />,
            //     href: '/admin/more/counties'
            // },
            {
                label: 'Products',
                icon: <IconShoppingBag {...ICON_PROPS} />,
                href: '/admin/more/products'
            },
            {
                label: 'Orders',
                icon: <IconReceipt {...ICON_PROPS} />,
                href: '/admin/more/orders'
            },
        ],
    },
    {
        id: "extra",
        label: "Extra",
        links: [
            {
                label: 'Newsletter Subscribers',
                icon: <IconUserStar {...ICON_PROPS} />,
                href: '/admin/more/subscribers'
            },
            {
                label: 'Reviews',
                icon: <IconStar {...ICON_PROPS} />,
                href: '/admin/more/reviews'
            },
            {
                label: 'Categories',
                icon: <IconCategory {...ICON_PROPS} />,
                href: '/admin/more/categories'
            },
            {
                label: 'Articles',
                icon: <IconCategory {...ICON_PROPS} />,
                href: '/admin/more/articles'
            },
            {
                label: 'FAQs',
                icon: <IconQuestionMark {...ICON_PROPS} />,
                href: '/admin/more/faqs'
            },
            {
                label: 'Create Blog',
                icon: <IconArticle {...ICON_PROPS} />,
                href: '/admin/more/create-blog'
            }
        ],
    },
]

interface AdminWrapperProps {
    children: React.ReactNode
}

export default function AdminWrapper({ children }: AdminWrapperProps) {
    const { colorScheme } = useMantineColorScheme()

    const { logout, login_status } = useAppContext()
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
                breakpoint: 'xs',
                width: { sm: 200, lg: 300 },
                collapsed: { desktop: false, mobile: !opened }
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
                                onClick={closeDrawer}
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
                            background: theme.colors.orange[8],
                            color: theme.colors.gray[2],
                            // fontSize: '42px'
                        })} />
                    </Stack>
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main>
                <div style={{ minHeight: "90vh" }}>
                    <Container size={'xl'} py="lg">
                        <Box p="lg" style={theme => ({
                            background: isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[2],
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