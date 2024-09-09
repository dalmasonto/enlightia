import React from 'react'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'
import { RequestProps, makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { Box, Stack, Text, Title } from '@mantine/core'
import SEOHeader from '@/components/seo/SEOHeader'
import { useRouter } from 'next/router'
import UpdateTopicWithFewFieldsForm from '@/components/courses/TopicFormWithFewFields'
import UpdateCourseTopics from '@/components/courses/UpdateCourseTopics'

interface ITopics {
  topics: any
  error: boolean
  course: any
}

const TopicsWithSubTopics = ({ topics, error, course }: ITopics) => {
  const { query } = useRouter()
  return (
    <div>
      <SEOHeader
        url={''}
        title={'Course Topics - Quick Update'}
        description={''}
        keywords={''}
        image={''}
        twitter_card={''} />
      <Stack>
        <Box>
          <Title>Course Topics</Title>
          <Text size="sm">Bulk update all course topics adding topic title, its subtopics and other fields.</Text>
        </Box>
        {/* {
          topics?.map((topic: any, i: number) => (
            <UpdateTopicWithFewFieldsForm key={topic?.id} topic={topic} courseID={query.cid} courseSLUG={query.cslug} />
          ))
        } */}
        <UpdateCourseTopics course={course} />
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
        fields: "id, title,slug,subtopics,period,order,description", course__id: query.cid,
        parent__isnull: true
      },
    }
    const topicsQuery = await makeRequestOne(topicsReqOptions)

    const courseReqOptions: RequestProps = {
      url: `${API_ENDPOINTS.COURSES}/${query.cid}`,
      method: 'GET',
      params: {
        fields: "id,title,description",
        // parent__isnull: true
      },
    }
    const courseData = await makeRequestOne(courseReqOptions)

    return {
      props: {
        // topics: topicsQuery?.data?.results,
        course: {
          ...courseData?.data,
          topics: topicsQuery?.data?.results
        }
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

TopicsWithSubTopics.PageLayout = InstitutionWrapper
export default TopicsWithSubTopics