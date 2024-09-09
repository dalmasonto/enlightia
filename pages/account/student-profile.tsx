import CourseCardVertical from "@/components/courses/CourseCardVertical"
import NoDataFound from "@/components/errors/NoDataFound"
import { makeRequestOne } from "@/config/config"
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from "@/config/constants"
import { displayErrors } from "@/config/functions"
import AccountWrapper from "@/layouts/AccountWrapper"
import { useAppContext } from "@/providers/appProvider"
import { Container, Button, Group, Title, Grid, Text, Box, Stack } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { IconAlertCircle, IconAlertTriangle } from "@tabler/icons-react"
import { useState } from "react"



const RegisterAsStudentButton = () => {

    const { token, user, logout } = useAppContext()
    const CAN_REGISTER_INSTRUCTOR = user?.profile?.can_register_student
    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            email: null,
            user: null,
        }
    })

    const handleRegister = () => {
        setLoading(true)
        makeRequestOne({
            url: API_ENDPOINTS.STUDENTS,
            method: 'POST',
            data: {
                user: user?.id,
                email: user?.email
            },
            extra_headers: {
                authorization: `Bearer ${token}`
            },
            useNext: false
        }).then((res: any) => {
            showNotification({
                title: "Success",
                message: "You are now a registered student.",
                color: "green",
                icon: <IconAlertCircle stroke={1.5} />
            })
            logout()
        }).catch((error) => {
            const errors = error?.response?.data
            displayErrors(form, errors)

            showNotification({
                title: "Error",
                message: "Something went wrong",
                color: "red",
                icon: <IconAlertTriangle stroke={1.5} />
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div>
            <Container fluid size="lg" py={20}>
                {
                    CAN_REGISTER_INSTRUCTOR ? (
                        <>
                            <Button loading={loading} onClick={handleRegister} radius={'xl'} w={'200px'} variant="filled">
                                Register
                            </Button>
                        </>
                    ) : <Text>You are not allowed to register as a student</Text>
                }
                {
                    Object.keys(form.errors).map((field: string, i: number) => (
                        <Group key={`error_${i}`} align='center'>
                            <Text size="sm">{field}</Text>
                            <Text size="sm" color='red'>{form.errors[field]}</Text>
                        </Group>
                    ))
                }
            </Container>
        </div>
    )
}

interface IProfile {
    userDetails: any
    enrollments: any
    completed_courses: any
}

const StudentProfile = ({ enrollments, userDetails, completed_courses }: IProfile) => {
    const user = userDetails
    const student = userDetails?.student

    return (
        <div>
            <Container fluid size="xl">
                <Stack gap={'xl'}>
                    <Box>
                        <Title order={2} fw={500}>Instructor Profile</Title>
                        <Text fw={500}>{`Welcome back @${user?.username}`}</Text>
                        <Text mt={'md'}>
                            This is your student profile. From this profile, you can be able to track the enrolled courses, completed courses and quick statistics
                        </Text>
                    </Box>
                    {
                        !student ? (
                            <Box>
                                <RegisterAsStudentButton />
                            </Box>
                        ) : null
                    }
                    <Box size="lg">
                        <Title order={2} fw={400} mb="md">Enrolled Courses</Title>
                        <NoDataFound visible={enrollments?.length === 0} description='You have not enrolled to any course' />
                        <Grid>
                            {
                                enrollments?.map((enrollment: any) => (
                                    <Grid.Col key={`course_${enrollment?.id}`} span={{ lg: 2, md: 4, sm: 6, xs: 6 }} >
                                        <CourseCardVertical {...enrollment.course} cohort={enrollment?.cohort?.title} />
                                    </Grid.Col>
                                ))
                            }
                        </Grid>
                    </Box>
                    <Box size="lg">
                        <Title order={2} fw={400} mb="md">Completed Courses</Title>
                        <NoDataFound visible={completed_courses?.length === 0} description='You have not completed any course' />
                        <Grid>
                            {
                                completed_courses?.map((completed_entry: any) => (
                                    <Grid.Col key={`course_${completed_entry?.id}`} span={{ md: 4, sm: 6, xs: 6 }} >
                                        <CourseCardVertical {...completed_entry.course} />
                                    </Grid.Col>
                                ))
                            }
                        </Grid>
                    </Box>
                </Stack>
            </Container>
        </div>
    )
}


export const getServerSideProps = async (context: any) => {
    const cookies = context.req.cookies
    const userDetails_: any = cookies[LOCAL_STORAGE_KEYS.user]
    const token = cookies[LOCAL_STORAGE_KEYS.token]

    const userDetails: any = JSON.parse(userDetails_ ?? "{}")

    try {

        const enrollmentsQuery = await makeRequestOne(
            {
                url: API_ENDPOINTS.ENROLLMENTS,
                method: "GET",
                params: { student: userDetails?.student ?? 0, fields: "id,student,course,cohort,title,slug,banner,description" },
                extra_headers: {
                    authorization: `Bearer ${token}`
                }
            }
        )

        const completedCoursesQuery = await makeRequestOne(
            {
                url: API_ENDPOINTS.COMPLETED_COURSES,
                method: "GET",
                params: { student__id: userDetails?.student ?? 0, fields: "id,student,course,cohort,title,slug,banner,description" },
                extra_headers: {
                    authorization: `Bearer ${token}`
                }
            }
        )

        return {
            props: {
                userDetails,
                enrollments: enrollmentsQuery?.data.results,
                completed_courses: completedCoursesQuery?.data?.results,
            }
        }
    } catch (err) {
        return {
            props: {

            }
        }
    }
}

StudentProfile.PageLayout = AccountWrapper
export default StudentProfile