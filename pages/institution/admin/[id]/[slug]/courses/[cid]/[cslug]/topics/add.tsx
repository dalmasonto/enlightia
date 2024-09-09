import React from 'react'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'
import { RequestProps, makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { Stack, Title } from '@mantine/core'
import SEOHeader from '@/components/seo/SEOHeader'
import TopicForm from '@/components/courses/TopicForm'

interface IAddTopic {
  topics: any
  error: boolean
}

const AddTopic = ({ topics, error }: IAddTopic) => {
  return (
    <div>
      <SEOHeader
        url={''}
        title={'Add New Topic'}
        description={''}
        keywords={''}
        image={''}
        twitter_card={''} />
      <Stack>
        <Title fw={500} order={2}>Add Topic/Sub-topic</Title>
        <TopicForm updating={false} topics={topics} />
      </Stack>
    </div>
  )
}


export async function getServerSideProps(context: any) {
  // const cookies = context.req.cookies
  // const userDetails_: any = cookies[LOCAL_STORAGE_KEYS.user]

  // const token = cookies[LOCAL_STORAGE_KEYS.token]

  // const userDetails: any = JSON.parse(userDetails_ ?? "{}")
  try {
    const query = context?.query
    const topicsReqOptions: RequestProps = {
      url: `${API_ENDPOINTS.TOPICS}`,
      method: 'GET',
      params: {
        fields: "id, title, slug, order", course__id: query?.cid,
        // parent__isnull: true 
      },
    }
    const topicsQuery = await makeRequestOne(topicsReqOptions)

    return {
      props: {
        topics: topicsQuery?.data?.results,
      }
    }
  } catch (err) {
    return {
      props: {
        error: true
      }
    }
  }
}

AddTopic.PageLayout = InstitutionWrapper
export default AddTopic