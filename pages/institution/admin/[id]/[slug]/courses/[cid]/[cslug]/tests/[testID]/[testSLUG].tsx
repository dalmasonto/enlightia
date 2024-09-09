import BackButton from "@/components/common/BackButton"
import CreateQuiz from "@/components/questions/CreateQuiz"
import { RequestProps, makeRequestOne } from "@/config/config"
import { API_ENDPOINTS } from "@/config/constants"
import InstitutionWrapper from "@/layouts/InstitutionWrapper"
import { Stack, Group, Title, useMantineTheme, useMantineColorScheme } from "@mantine/core"
import { GetServerSidePropsContext } from "next"



interface ISingleTest {
    test: any
    questions: any
}

const SingleTest = ({ test, questions }: ISingleTest) => {
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()

    return (
        <div>
            <Stack gap={20}>
                <Group align='center' gap={20}>
                    <BackButton />
                    <Title order={2} fw={500}>{test?.title}</Title>
                </Group>
                <CreateQuiz testID={test?.id} updating={true} questions={questions} />
            </Stack>
        </div>
    )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const query = ctx.query

    const testReqOptions: RequestProps = {
        url: `${API_ENDPOINTS.TESTS}/${query.testID}`,
        method: 'GET',
        // params: { fields: "id,title,slug,questions" },
    }

    // const questionsReqOptions: RequestProps = {
    //     url: `${API_ENDPOINTS.TEST_QUESTIONS}`,
    //     method: 'GET',
    //     // params: { fields: "id,title,slug,description,banner" },
    //     params: { test__id: query.testID },
    // }

    const testQuery = await makeRequestOne(testReqOptions)
    // const queationsQuery = await makeRequestOne(questionsReqOptions)

    const completedTestsQuery = await makeRequestOne({
        url: `${API_ENDPOINTS.COMPLETED_TESTS}`,
        method: 'GET',
        params: {
            test__id: query.testID,
            ordering: "-id",
            fields: "id,test,course,title,cohort,student,user,full_name,created_on"
        }
    })

    return {
        props: {
            test: testQuery.data,
            questions: testQuery.data?.questions,
            submissions: completedTestsQuery?.data?.results
        },
    }
}


SingleTest.PageLayout = InstitutionWrapper

export default SingleTest
