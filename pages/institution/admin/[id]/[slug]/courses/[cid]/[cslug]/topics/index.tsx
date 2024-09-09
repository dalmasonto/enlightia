import React from 'react'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'
import { RequestProps, makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { SingleTopicCard } from '@/components/courses/TopicCards'
import { Grid, Stack, Title } from '@mantine/core'
import SEOHeader from '@/components/seo/SEOHeader'

interface ITopics {
  topics: any
  error: boolean
}

const Topics = ({ topics, error }: ITopics) => {
  return (
    <div>
      <SEOHeader
        url={''}
        title={'Course Topics'}
        description={''}
        keywords={''}
        image={''}
        twitter_card={''} />
      <Stack>
        <Title fw={500} order={2}>Course Topics</Title>
        <Grid>
          {
            topics?.map((topic: any, i: any) => (
              <Grid.Col key={`plain_topic_${topic.id}`} span={{ md: 4 }}>
                <SingleTopicCard topic={topic} index={i + 1} />
              </Grid.Col>
            ))
          }
        </Grid>
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

Topics.PageLayout = InstitutionWrapper
export default Topics