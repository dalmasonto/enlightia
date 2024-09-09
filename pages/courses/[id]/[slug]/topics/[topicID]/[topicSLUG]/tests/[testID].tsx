import RenderQuiz from "@/components/questions/RenderQuiz"
import { RequestProps, isDarkMode, makeRequestOne } from "@/config/config"
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from "@/config/constants"
import { checkIfEnrolledServerSide } from "@/config/functions"
import CourseWrapper from "@/layouts/CourseWrapper"
import { Stack, Title, Paper, Text, lighten, darken, useMantineColorScheme } from "@mantine/core"
// import { redirect } from "next/dist/server/api-utils"

interface ISingleTopic {
    test: any
    doneTest: any
}


const SingleTest = ({ test, doneTest }: ISingleTopic) => {
    const { colorScheme } = useMantineColorScheme()
    return (
        <>
            <Stack>
                <Title order={2} fw={500}>{test?.title}</Title>
                <Text>
                    {test?.description}
                </Text>
                <Paper p="lg" style={theme => ({
                    borderRadius: theme.radius.lg,
                    background: isDarkMode(colorScheme) ? darken(theme.colors.blue[5], 0.9) : lighten(theme.colors.blue[5], 0.5)
                })}>
                    <RenderQuiz questions={test?.questions ?? []} testID={test?.id} completedTest={doneTest?.length > 0 ? doneTest[0] : null} isInstructor={false} />
                </Paper>
            </Stack>
        </>
    )
}

export const getServerSideProps = async (context: any) => {
    const { params } = context

    const cookies = context.req.cookies
    const userDetails_: any = cookies[LOCAL_STORAGE_KEYS.user]
    const user = JSON.parse(userDetails_ || 'null')
    const token = cookies[LOCAL_STORAGE_KEYS.token]

    const enrolledCourses = await checkIfEnrolledServerSide(token, user?.student, params?.id)

    if (enrolledCourses?.length < 1) {
        return {
            redirect: {
                permanet: false,
                destination: `/courses/${params?.id}/${params?.slug}?require_enrollment=true&tab=enrollment`
            },
            props: {

            }
        }
    }

    const testReqOptions: RequestProps = {
        method: "GET",
        url: `${API_ENDPOINTS.TESTS}/${params.testID}`,
        params: {
            topics__id: params?.topicID, cohort__active: true,
            fields: "id,title,topics,description,question_count,questions,question,options,question_type,answer,points",
        }
    }

    const doneTest = await makeRequestOne({
        method: "GET",
        url: `${API_ENDPOINTS.COMPLETED_TESTS}`,
        params: {
            // fields: "id,quiz,answers",
            student__id: user?.student ?? 0,
            test__id: params?.testID
        }
    }
    )
    const test = await makeRequestOne(testReqOptions)
    // const doneTests = await makeRequestOne(hasDoneTest)
    return {
        props: {
            doneTest: doneTest.data?.results,
            test: test.data,
            // hasDoneTest: doneTests?.data?.results?.length > 0
        },
        // revalidate: 10,
    }
}

SingleTest.PageLayout = CourseWrapper
export default SingleTest