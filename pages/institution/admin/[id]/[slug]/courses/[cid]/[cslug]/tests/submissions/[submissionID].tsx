import BackButton from "@/components/common/BackButton"
import CreateQuiz from "@/components/questions/CreateQuiz"
import RenderQuiz from "@/components/questions/RenderQuiz"
import { RequestProps, makeRequestOne } from "@/config/config"
import { API_ENDPOINTS } from "@/config/constants"
import InstitutionWrapper from "@/layouts/InstitutionWrapper"
import { Stack, Group, Title, useMantineTheme, useMantineColorScheme } from "@mantine/core"
import { GetServerSidePropsContext } from "next"



interface ISingleTestSubmission {
    test: any
    questions: any
}

const SingleTestSubmission = ({ test, questions }: ISingleTestSubmission) => {
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()

    return (
        <div>
            <Stack gap={20}>
                <Group align='center' gap={20}>
                    <BackButton />
                    <Title order={2} fw={500}>{test?.title}</Title>
                </Group>
                <RenderQuiz questions={[]} testID={test?.test?.id} isInstructor={true} completedTest={test}  />
            </Stack>
        </div>
    )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const query = ctx.query

    const testReqOptions: RequestProps = {
        url: `${API_ENDPOINTS.COMPLETED_TESTS}/${query.submissionID}`,
        method: 'GET',
        params: { fields: "id,checked,instructor_note,points,student,user,full_name,answers,marked,written_answer,answers,quiz,question_type,question,options,is_correct,answer,test,total_points" },
    }

    const testQuery = await makeRequestOne(testReqOptions)
    return {
        props: {
            test: testQuery.data,
        },
    }
}


SingleTestSubmission.PageLayout = InstitutionWrapper

export default SingleTestSubmission
