import React from 'react'
import { Anchor, Box, ActionIcon, Center, Container, Divider, Grid, Group, Image, List, Stack, Text, Title, useMantineTheme, useMantineColorScheme, darken } from '@mantine/core';
import { BLUE_DARK_COLOR, APP_NAME, LINK_WEIGHT } from '../../config/constants';
import Link from 'next/link';
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandTwitter, IconBrandWhatsapp, IconMessage, IconPhoneCall, IconMailFast, IconChevronRight } from '@tabler/icons-react';
import { isDarkMode } from '@/config/config';


interface ServiceProps {
    title: string,
    href: string,
    icon?: React.ReactElement
    target?: string
}

const Service = (props: ServiceProps) => {
    const { title, href, icon, target } = props
    return (
        <List.Item icon={icon}>
            <Anchor href={href} target={target} component={Link} style={{
                textDecoration: "none"
            }} fw={LINK_WEIGHT}>
                <Text c="white" size="sm">{title}</Text>
            </Anchor>
        </List.Item >
    )
}

const services: ServiceProps[] = [
    {
        title: "Service One",
        href: "/",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
    {
        title: "Serivce Two ",
        href: "/",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
    {
        title: "Service Three",
        href: "/",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
    {
        title: "Service Four ",
        href: "/",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
]

const contacts: ServiceProps[] = [
    {
        title: "+254742407266",
        href: "tel:+254742407266",
        icon: <IconPhoneCall color="white" stroke={1.5} />,
        target: "_blank"
    },
    {
        title: "sms +254742407266",
        href: "sms:+254742407266",
        icon: <IconMessage color="white" stroke={1.5} />,
        target: "_blank"
    },
    {
        title: "+254742407266",
        href: "https://wa.link/nxwlz1",
        icon: <IconBrandWhatsapp color="white" stroke={1.5} />,
        target: "_blank"
    },
    {
        title: "info@livesoftwaredeveloper.com",
        href: "mailto:info@livesoftwaredeveloper.com",
        icon: <IconMailFast color="white" stroke={1.5} />
    },
]

const support: ServiceProps[] = [
    {
        title: "Our Blog",
        href: "/articles",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
    {
        title: "Contact Us",
        href: "/contact-us",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
    {
        title: "Raise Support Ticket",
        href: "https://hosting.livesoftwaredeveloper.com/submitticket.php?step=2&deptid=1",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
    {
        title: "Live Chat",
        href: "https://tawk.to/livesoftwaredeveloper",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
]



const quickLinks: ServiceProps[] = [
    {
        title: "Link One",
        href: "/",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
    {
        title: "Link Two",
        href: "/",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
    {
        title: "Link Three ",
        href: "/",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
    {
        title: "Link Four",
        href: "/",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
    {
        title: "Link Five",
        href: "/",
        icon: <IconChevronRight color="white" stroke={1.5} />
    },
]

const CustomFooter = () => {
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()

    return (
        <Box c={"white"} bg={isDarkMode(colorScheme) ? darken(theme.colors[theme.primaryColor][9], 0.5) : theme.colors[theme.primaryColor][8]} style={{
        }} pt={80} pos={'relative'}>
            <Stack gap={0}>

                <Box>
                    <Container py={16} size={"xl"}>
                        <Grid >
                            <Grid.Col span={{ md: 3, sm: 12 }}>
                                <Stack gap="md" pe={'lg'}>
                                    {/* <Image width={180} loading='lazy' src={isDarkMode(colorScheme) ? '/logo_orange.png' : '/logo_black_small.png'} /> */}
                                    <Text>
                                        Explore a world of knowledge with our cutting-edge LMS
                                    </Text>
                                    <List spacing="xs">
                                        {contacts.map((service: ServiceProps, i: number) => (
                                            <Service key={`contacts_${i}`} {...service} />
                                        ))}
                                    </List>
                                    <Group>
                                        <Anchor href='https://www.facebook.com/livesoftwaredeveloper/' target='_blank' style={{
                                            textDecoration: "none"
                                        }}>
                                            <ActionIcon size={48} radius="md" variant="light" color="white">
                                                <IconBrandFacebook stroke={1.5} />
                                            </ActionIcon>
                                        </Anchor>
                                        <Anchor href='https://www.linkedin.com/company/live-software-developer' target='_blank' style={{
                                            textDecoration: "none"
                                        }}>
                                            <ActionIcon size={48} radius="md" variant="light" color="white">
                                                <IconBrandLinkedin stroke={1.5} />
                                            </ActionIcon>
                                        </Anchor>
                                        <Anchor href='https://www.instagram.com/lsdsoftware/' target='_blank' style={{
                                            textDecoration: "none"
                                        }}>
                                            <ActionIcon size={48} radius="md" variant="light" color="white">
                                                <IconBrandInstagram stroke={1.5} />
                                            </ActionIcon>
                                        </Anchor>
                                        <Anchor href='https://x.com/LiveSoftwareDev' target='_blank' style={{
                                            textDecoration: "none"
                                        }}>
                                            <ActionIcon size={48} radius="md" variant="light" color="white">
                                                <IconBrandTwitter stroke={1.5} />
                                            </ActionIcon>
                                        </Anchor>
                                    </Group>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={{ md: 3, sm: 12 }}>
                                <Stack gap="md">
                                    <Title order={5}>Best Courses</Title>
                                    <List>
                                        {[].map((service: ServiceProps, i: number) => (
                                            <Service key={`service_one_${i}`} {...service} />
                                        ))}
                                    </List>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={{ md: 3, sm: 12 }}>
                                <Stack gap="md">
                                    <Title order={5}>Recent Courses</Title>
                                    <List>
                                        {[].map((service: ServiceProps, i: number) => (
                                            <Service key={`service_two_${i}`} {...service} />
                                        ))}
                                    </List>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={{ md: 3, sm: 12 }}>
                                <Stack gap="md">
                                    <Title order={5}>Support</Title>
                                    <List>
                                        {support.map((service: ServiceProps, i: number) => (
                                            <Service key={`service_one_${i}`} {...service} />
                                        ))}
                                    </List>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Container>
                </Box>

                <Box py={16} style={{
                    borderTopWidth: "1px",
                    borderTopStyle: "solid",
                    borderTopColor: isDarkMode(colorScheme) ? theme.colors.dark[2] : theme.colors.gray[5]
                }}>
                    <Container size="lg">
                        <Grid>
                            <Grid.Col span={{ md: 8, sm: 12 }}>
                                <Group align="center">
                                    <Text fw={400}>Payments We Accept: </Text>
                                    <Image loading='lazy' src="https://img.icons8.com/color/48/null/visa.png" alt='Pay with Visa Card' width="48px" />
                                    <Image loading='lazy' src="https://img.icons8.com/color/48/null/mastercard-logo.png" alt='Pay with Master Card' width="48px" />
                                    <Image loading='lazy' src="https://img.icons8.com/fluency/48/null/paypal.png" alt='Pay with Paypal' width="48px" />
                                    <Box style={{
                                        background: "white",
                                        borderRadius: theme.radius.md,
                                        padding: "4px 8px"
                                    }}>
                                        <Image loading='lazy' src="/assets/images/mpesa.png" alt='Pay with MPesa' width="120px" />
                                    </Box>
                                </Group>
                            </Grid.Col>
                            <Grid.Col span={{ md: 4, sm: 12 }}>
                                <Center className='h-100'>
                                    <Group justify="center">
                                        <Anchor href='/' component={Link} style={{
                                            textDecoration: "none"
                                        }}>
                                            <Text size="sm" c="white">Terms of Service</Text>
                                        </Anchor>
                                        <Divider orientation='vertical' color={isDarkMode(colorScheme) ? theme.colors.dark[2] : theme.colors.gray[2]} />
                                        <Anchor href='/' component={Link} style={{
                                            textDecoration: "none"
                                        }}>
                                            <Text size="sm" c="white">Privacy Policy</Text>
                                        </Anchor>
                                    </Group>
                                </Center>
                            </Grid.Col>
                        </Grid>
                    </Container>
                </Box>

                <Box py={16} style={{
                    borderTopWidth: "1px",
                    borderTopStyle: "solid",
                    borderTopColor: isDarkMode(colorScheme) ? theme.colors.dark[2] : theme.colors.gray[5]
                }}>
                    <Text size="sm" fw={300} ta="center"> Copyright &copy; 2023 {APP_NAME}. Design by <Anchor href='https://livesoftwaredeveloper.com'>Live Software Developer</Anchor> </Text>
                </Box>

            </Stack>
        </Box>
    )
}

export default CustomFooter