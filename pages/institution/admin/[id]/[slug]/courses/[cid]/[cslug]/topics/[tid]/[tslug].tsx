import BackButton from "@/components/common/BackButton"
import RenderTopic from "@/components/courses/RenderTopic"
import TopicForm from "@/components/courses/TopicForm"
import { RequestProps, makeRequestOne } from "@/config/config"
import { API_ENDPOINTS } from "@/config/constants"
import InstitutionWrapper from "@/layouts/InstitutionWrapper"
import { Container, Tabs } from "@mantine/core"
import { GetServerSidePropsContext } from "next"


interface ISingleTopicUpdate {
  topic: any
  otherTopics: any
}

const SingleTopicUpdate = (props: ISingleTopicUpdate) => {
  const { topic, otherTopics } = props
  return (
    <div>
      <Container size="xl">
        <BackButton />
        <Tabs defaultValue="preview">
          <Tabs.List>
            <Tabs.Tab value='preview'>Preview</Tabs.Tab>
            <Tabs.Tab value='edit'>Edit</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='preview' py="md">
            <RenderTopic topic={topic} />
          </Tabs.Panel>
          <Tabs.Panel value='edit' py="md">
            <TopicForm updating={true} topics={otherTopics} data={topic} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </div>
  )
}



export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const query = ctx.query

  const topicReqOptions: RequestProps = {
    url: `${API_ENDPOINTS.TOPICS}/${query.tid}`,
    method: 'GET',
    // params: { fields: "id,title,slug,description,banner" },
    params: {},
  }

  const plainTopicsReqOptions: RequestProps = {
    url: `${API_ENDPOINTS.TOPICS}`,
    method: 'GET',
    params: {
      fields: "id,title", course__id: query.cid, limit: 100,
      // parent__isnull: true 
    },
  }

  const topicQuery = await makeRequestOne(topicReqOptions)
  const plainTopicsQuery = await makeRequestOne(plainTopicsReqOptions)
  return {
    props: {
      topic: topicQuery.data,
      otherTopics: plainTopicsQuery?.data?.results,
    },
  }
}


SingleTopicUpdate.PageLayout = InstitutionWrapper
export default SingleTopicUpdate