import React from 'react'
import { Alert, Grid, Stack, Title } from '@mantine/core'
import { makeRequestOne, RequestProps } from '../../../../config/config'
import { API_ENDPOINTS } from '@/config/constants'
import CourseWrapper from '@/layouts/CourseWrapper'
import TestCard from '@/components/courses/tests/TestCard'
import tests from './topics/[topicID]/[topicSLUG]/tests'
import { useRouter } from 'next/router'
import { IconAlertTriangle } from '@tabler/icons-react'

const Tests = (props: any) => {

  const { query } = useRouter()
  const { tests } = props

  const testURL = `/courses/${query?.id}/${query?.slug}/topics/${query?.id}/${query?.topicID}/tests`
  const getTestUrl = (test_id: any) => {
    return `${testURL}/${test_id}`
  }

  return (
    <>
      <Stack p={0}>
        <Title ta='center' mx="auto">Course Tests</Title>
        {
          tests?.length === 0 ? (
            <Alert color={'yellow'} radius={'md'} icon={<IconAlertTriangle />} title={"No Test(s)"}>
              There are no tests for this course yet. Check back later.
            </Alert>
          ) : null
        }
        <Grid>

          {
            tests?.map((test: any) => (
              <Grid.Col key={`test_${test?.id}`} span={{ md: 4 }}>
                <TestCard test={test} hasCompletedTopic={false} testURL={getTestUrl(test?.id)} hideStartTestButton={true} />
              </Grid.Col>
            ))
          }
        </Grid>
      </Stack >
    </>
  )
}

export async function getStaticPaths() {
  const courses: any = await makeRequestOne({ url: `${API_ENDPOINTS.COURSES}`, method: "GET", params: { limit: 1, fields: 'id,slug' } })
  let paths = []
  if (courses?.success) {
    paths = courses?.success?.results?.map((course: any) => {
      return {
        params: { id: course?.id.toString(), slug: course?.slug.toString() },
      }
    })
  }

  return {
    paths: paths,
    fallback: true, // can also be true, false or 'blocking',
  }
}


export const getStaticProps = async (context: any) => {
  const { params } = context

  const courseReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.COURSES}/${params?.id}`,
    params: { fields: 'id,title,slug' }
  }

  const courseTopicReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.TOPICS}`,
    params: { course__id: params?.id, parent__isnull: true, fields: "id,title,slug,subtopics" }
  }

  const courseTestsForActiveCohortReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.TESTS}`,
    params: { course: params?.id, cohort__active: true, fields: "id,title,topics,description,question_count" }
  }

  const course = await makeRequestOne(courseReqOptions)
  const courseTopics = await makeRequestOne(courseTopicReqOptions)

  const tests = await makeRequestOne(courseTestsForActiveCohortReqOptions)

  return {
    props: {
      course: course.data,
      topics: courseTopics?.data?.results,
      tests: tests.data?.results
    },
    revalidate: 10,
  }
}

Tests.PageLayout = CourseWrapper
export default Tests