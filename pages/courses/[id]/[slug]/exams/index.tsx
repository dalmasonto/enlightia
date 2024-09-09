import React from 'react'
import { Container, Stack, Text, Title } from '@mantine/core'
import { makeRequestOne, RequestProps } from '../../../../../config/config'
import { API_ENDPOINTS } from '@/config/constants'
import CourseWrapper from '@/layouts/CourseWrapper'
const Exams = (props: any) => {

  const { course, topics } = props

  return (
      <Container mb={200} p={0}>
        <Stack p={0}>
          <Title ta='center' mx="auto" >Course Exams</Title>
          <Text>[IN DEVELOPMENT]</Text>
        </Stack>
      </Container>
  )
}

export async function getStaticPaths() {
  const courses: any = await makeRequestOne({url: `${API_ENDPOINTS.COURSES}`, method: "GET", params: { limit: 1, fields: 'id,slug' }})
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

  const course = await makeRequestOne(courseReqOptions)
  const courseTopics = await makeRequestOne(courseTopicReqOptions)

  return {
    props: {
      course: course.data,
      topics: courseTopics?.data?.results,
    },
    revalidate: 10,
  }
}

Exams.PageLayout = CourseWrapper
export default Exams