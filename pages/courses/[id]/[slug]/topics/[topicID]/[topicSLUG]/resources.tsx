import NoDataFound from "@/components/errors/NoDataFound"
import { RequestProps, makeRequestOne } from "@/config/config"
import { API_ENDPOINTS } from "@/config/constants"
import CourseWrapper from "@/layouts/CourseWrapper"
import { Stack, Title } from "@mantine/core"
import { IconAlertTriangle } from "@tabler/icons-react"


interface ISingleTopic {
  topic: any
  resources: any
}


const Resources = ({ topic, resources }: ISingleTopic) => {
  return (
      <Stack>
        <Title order={2} fw={500}>Topic Resources ({resources?.length})</Title>
        <NoDataFound visible={resources?.length === 0} icon={<IconAlertTriangle size={32} color='yellow' />} title='No Tests' description={'No Tests Found'} />
      </Stack>
  )
}

export const getServerSideProps = async (context: any) => {
  const { params } = context

  const topicReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.TOPICS}/${params.topicID}`,
    params: {
      fields: "id,title,notes,slug,course,course_slug"
    }
  }

  const testForTopicandActiveCohortReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.TESTS}`,
    params: {
      topics__id: params?.topicID, cohort__active: true,
      // fields: "id,title,topics,description,question_count,questions,question,answers,answer,type", 
      fields: "id,title,topics,question_count",
    }
  }

  const topic = await makeRequestOne(topicReqOptions)
  const resources = await makeRequestOne(testForTopicandActiveCohortReqOptions)
  
  return {
    props: {
      topic: topic.data,
      resources: resources.data?.results
    },
    // revalidate: 10,
  }
}

Resources.PageLayout = CourseWrapper
export default Resources