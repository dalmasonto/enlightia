import RenderTopic from '@/components/courses/RenderTopic'
import TestQuizForm from '@/components/courses/tests/TestQuizForm'
import CompleteTopicButton from '@/components/courses/topics/CompleteTopicButton'
import NoDataFound from '@/components/errors/NoDataFound'
import { isDarkMode, makeRequestOne, RequestProps } from '@/config/config'
import { API_ENDPOINTS, EMOJIS } from '@/config/constants'
import { checkIfEnrolledClientSide, getTheme } from '@/config/functions'
import CourseWrapper from '@/layouts/CourseWrapper'
import { useAppContext } from '@/providers/appProvider'
import { Accordion, Box, Button, Center, darken, lighten, Loader, Paper, Stack, Text, Title, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconWriting } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

interface ISingleTopic {
  topic: any
  tests: any,
  subtopics: any
}

const SingleTopic = ({ topic, tests }: ISingleTopic) => {


  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const { token, user } = useAppContext()
  const { push, query } = useRouter()




  if (!topic) {
    return (
      <Center style={{ height: "60vh" }}>
        <Loader variant='bars' size={'md'} />
      </Center>
    )
  }

  useEffect(() => {
    checkIfEnrolledClientSide(token, user?.student, query?.id, push, `/courses/${query?.id}/${query?.slug}?require_enrollment=true&tab=enrollment`)
  }, [token, user])

  return (
    <Stack pb={100}>
      <CompleteTopicButton />
      <RenderTopic topic={topic} />
      {/* {
          hasCompletedTopic ? (
            <div>
              <Title order={3} fw={500} mb="md"> {`${tests?.length} Test(s)`} </Title>
              <NoDataFound visible={tests?.length === 0} description='There are no tests for this topic' />
              <Accordion>
                {
                  tests?.map((test: any) => (
                    <Accordion.Item key={`test_${test.id}`} value={`test_${test.id}`}>
                      <Accordion.Control icon={<IconWriting />}>{test?.title}</Accordion.Control>
                      <Accordion.Panel>
                        <Paper p="lg" style={theme => ({
                          borderRadius: theme.radius.lg,
                          background: isDarkMode(colorScheme) ? darken(theme.colors.blue[5], 0.9) : lighten(theme.colors.blue[5], 0.5)
                        })}>
                          <Title order={3} fw={500}>{`${test?.title} - ${test?.questions?.length} Questions`}</Title>
                          <Text size="sm" mb="xs">{test?.description}</Text>
                          <TestQuizForm test={test} />
                        </Paper>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))
                }
              </Accordion>
            </div>
          ) : null
        } */}
    </Stack>
  )
}

export async function getStaticPaths() {

  const topicsReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.TOPICS}`,
    params: { fields: "id,slug,course,course_slug", limit: 1 }
  }

  const topics = await makeRequestOne(topicsReqOptions)

  const paths = topics?.data?.results?.map((topic: any) => {
    return {
      params: { id: topic?.course?.toString(), slug: topic?.course_slug?.toString(), topicID: topic?.id.toString(), topicSLUG: topic?.slug.toString() },
    }
  })

  return {
    paths: paths,
    fallback: "blocking", // can also be true, false or 'blocking',
  }
}


export const getStaticProps = async (context: any) => {
  const { params } = context

  const topicReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.TOPICS}/${params?.topicID}`,
    params: {
      fields: "id,title,notes,slug,description,course,course_slug"
    }
  }

  const testForTopicandActiveCohortReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.TESTS}`,
    params: { topics__id: params?.topicID, cohort__active: true, fields: "id,title,topics,description,question_count,questions,question,answers,answer,type" }
  }

  try {
    const topic = await makeRequestOne(topicReqOptions)
    const tests = await makeRequestOne(testForTopicandActiveCohortReqOptions)

    return {
      props: {
        topic: topic.data,
        tests: tests.data?.results,
      },
      revalidate: 10,
    }
  } catch (error: any) {
    console.error("Error fetching data:", error?.response)
    return {
      props: {
        topic: null,
        tests: [],
      },
      revalidate: 10,
    }
  }
}


SingleTopic.PageLayout = CourseWrapper
export default SingleTopic