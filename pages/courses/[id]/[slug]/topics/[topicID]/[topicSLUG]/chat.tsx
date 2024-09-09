import NoDataFound from '@/components/errors/NoDataFound'
import { RequestProps, makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import CourseWrapper from '@/layouts/CourseWrapper'
import { Stack, Title } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import React from 'react'

interface ISingleTopic {
  topic: any
}


const Chat = ({ topic }: ISingleTopic) => {
  return (
    <>
    {/* <TopicLayout topic={{ id: topic?.id, slug: topic?.slug }} course={{ id: topic?.course, slug: topic?.course_slug }}> */}
      <Stack>
        <Title order={2} fw={500}>Topic Chat</Title>
        <NoDataFound visible={true} icon={<IconAlertTriangle size={32} color='yellow' />} title='No Chat' description={'[IN DEVELOPMENT]'} />
      </Stack>
    {/* </TopicLayout> */}
    </>
  )
}

export const getServerSideProps = async (context: any) => {
  const { params } = context

  const topicReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.TOPICS}/${params.topicID}`,
    params: {
      fields: "id,title,notes,slug,description,course,course_slug"
    }
  }

  const testForTopicandActiveCohortReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.TESTS}`,
    params: {
      topics__id: params?.topicID, cohort__active: true,
      // fields: "id,title,topics,description,question_count,questions,question,answers,answer,type", 
      fields: "id,title,topics,description,question_count",
    }
  }

  const topic = await makeRequestOne(topicReqOptions)
  const chats = await makeRequestOne(testForTopicandActiveCohortReqOptions)
  
  return {
    props: {
      topic: topic.data,
      chats: chats.data?.results
    },
    // revalidate: 10,
  }
}

Chat.PageLayout = CourseWrapper
export default Chat