import { Anchor, Badge, Box, Button, Card, Group, Image, Loader, Stack, Text, Title, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import React, { useState } from 'react'

import Link from 'next/link'
import { isDarkMode, limitChars, makeRequestOne } from '../../config/config'
import { useRouter } from 'next/router'
import { showNotification } from '@mantine/notifications'
import { useAppContext } from '../../providers/appProvider'
import { modals } from '@mantine/modals'
import { API_ENDPOINTS } from '@/config/constants'
import { IconArrowRight, IconTrash } from '@tabler/icons-react'

export interface CourseProps {
    title: string,
    banner: any,
    description: string,
    slug?: string,
    id?: string,
    isAdmin?: boolean
    tags?: any,
    categories?: any
    cohort?: any
}

const CourseCardVertical = (props: CourseProps) => {
    const { id, slug, title, banner, description, isAdmin, tags, categories, cohort } = props
    const [loading, setLoading] = useState(false)
    const { query, reload } = useRouter()
    const { token } = useAppContext()

    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()


    const deleteCourse = () => {
        setLoading(true)
        makeRequestOne({
            url: `${API_ENDPOINTS.COURSES}/${id}`,
            method: "DELETE",
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            useNext: true
        }).then((res: any) => {
            showNotification({
                message: "Course deleted successfully",
                color: "green"
            })
            reload()
        }).catch(() => {
            showNotification({
                message: "Unable to delete course",
                color: "red"
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    const openDeleteConfirmModal = () => modals.openConfirmModal({
        title: "About to delete a course!",
        children: (
            <>
                <Text>Are you sure want to delete this course?</Text>
                <Text>{title}</Text>
            </>
        ),
        confirmProps: { title: "Delete", color: "red", leftSection: <IconTrash stroke={1.5} />, radius: "md" },
        cancelProps: { title: "Cancel", radius: "md" },
        labels: { confirm: "Delete", cancel: "Cancel" },
        centered: true,
        radius: "md",
        onConfirm() {
            deleteCourse()
        },
    })

    return (
        <Card p="xs" shadow='lg' className='h-100' radius="lg" style={{
            background: isDarkMode(colorScheme) ? theme.colors.dark[9] : theme.colors.gray[1]
        }}>
            <Card.Section>
                <Image
                    loading="lazy"
                    src={banner ?? "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"}
                    height={240}
                    alt={title}
                />
            </Card.Section>
            <Card.Section p={20}>
                <Group gap="xs">
                    {
                        categories?.map((cat: any, i: number) => (
                            <Badge key={`cat_${i}`} size='sm' color='blue' variant='filled' radius="sm">
                                {cat.title}
                            </Badge>
                        ))
                    }
                </Group>
                <Stack gap={4} style={{ position: 'relative' }}>
                    <Anchor component={Link} href={`/courses/${id}/${slug}`} passHref style={{
                        textDecoration: "none !important"
                    }}>
                        <Box>
                            <Title fw={400} order={4} style={{
                                cursor: "pointer",
                                ":hover": {
                                    color: theme.colors[theme.primaryColor][8]
                                },
                            }} mb="sm" size={18} lineClamp={1}>
                                {title}
                            </Title>
                        </Box>
                    </Anchor>
                    {/* {
                        cohort ?
                            <Text size="sm">
                                {`Cohort: ${cohort}`}
                            </Text>
                            : null
                    } */}
                    <Box style={{ height: "10ch", overflow: "hidden", wordBreak: 'break-all' }}>
                        <Text ta={'initial'} size="sm" lineClamp={4}>
                            {limitChars(description, 100)}
                        </Text>
                    </Box>
                    {/* <Text size="xs" lineClamp={4}>
                        {
                            [tags?.map((tag: any) => `#${tag?.title}`)].join(' ')
                        }
                    </Text> */}
                    {
                        isAdmin ? (
                            <Group justify='center' flex={1} w={'100%'}>
                                <Anchor flex={0.5} component={Link} href={`/institution/admin/${query?.id}/${query?.slug}/courses/${id}/${slug}`} passHref>
                                    <Button size="sm" variant='light' radius={'xl'} color={theme.colors.blue[6]} style={{ width: '100%' }}>
                                        Edit
                                    </Button>
                                </Anchor>
                                <Button flex={0.5} color={'red'} variant='light' radius={'xl'} loading={loading} onClick={openDeleteConfirmModal}>
                                    Delete
                                </Button>
                            </Group>
                        ) : (
                            <Button component={Link} href={`/courses/${id}/${slug}`} fullWidth radius={'xl'} variant='light' rightSection={<IconArrowRight />}>
                                Get Started
                            </Button>
                        )
                    }
                </Stack>
            </Card.Section>
        </Card >
    )
}

export default CourseCardVertical