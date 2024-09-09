import TestCard from '@/components/courses/tests/TestCard'
import NoDataFound from '@/components/errors/NoDataFound'
import { RequestProps, makeRequestOne } from '@/config/config'
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '@/config/constants'
import CourseWrapper from '@/layouts/CourseWrapper'
import { Card, Stack, Group, Title, ActionIcon, Anchor, Button, Grid, Text } from '@mantine/core'
import { IconClipboardTypography, IconClock, IconAlertTriangle } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'


interface ISingleTopic {
  tests: any
  completedTopics: any
}


const Tests = ({ tests, completedTopics }: ISingleTopic) => {
  const { query } = useRouter()
  const testURL = `/courses/${query?.id}/${query?.slug}/topics/${query?.topicID}/${query?.topicSLUG}/tests`
  const getTestUrl = (test_id: any) => {
    return `${testURL}/${test_id}`
  }

  const checkIfHasCompletedTopic = (test: any) => {
    const testTopics = test?.topics?.map((topic: any) => topic.id)
    const completedTestIds = completedTopics?.map((_test: any) => _test?.topic?.id);
    if (testTopics?.length > 0 && completedTestIds?.length > 0) {
      // return completedTestIds?.every((topic: any) => testTopics?.includes(topic));
      return testTopics.every((topic: any) => completedTestIds.includes(topic));
    }
    return false
  }

  return (
    <>
      <Stack>
        <Title order={2} fw={500}>Topic Tests ({tests?.length})</Title>
        <NoDataFound visible={tests?.length === 0} icon={<IconAlertTriangle size={32} color='yellow' />} title='No Tests' description={'No Tests Found'} />
        <Grid>
          {
            tests?.map((test: any) => (
              <Grid.Col key={`test_${test?.id}`} span={{ md: 6 }}>
                <TestCard test={test} hasCompletedTopic={checkIfHasCompletedTopic(test)} testURL={getTestUrl(test?.id)} hideStartTestButton={false} />
              </Grid.Col>
            ))
          }
        </Grid>
      </Stack>
    </>
  )
}

export const getServerSideProps = async (context: any) => {
  const { params } = context

  const cookies = context.req.cookies
  const userDetails_: any = cookies[LOCAL_STORAGE_KEYS.user]
  const user = JSON.parse(userDetails_ || 'null')
  const token = cookies[LOCAL_STORAGE_KEYS.token]


  const testForTopicandActiveCohortReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.TESTS}`,
    params: {
      topics__id: params?.topicID, cohort__active: true,
      // fields: "id,title,topics,description,question_count,questions,question,answers,answer,type", 
      fields: "id,title,topics,description,question_count",
    }
  }

  const tests = await makeRequestOne(testForTopicandActiveCohortReqOptions)
  const completedTopics = await makeRequestOne({
    url: API_ENDPOINTS.COMPLETED_TOPICS,
    method: "GET",
    extra_headers: {
      authorization: `Bearer ${token}`
    },
    params: { student__id: user?.student ?? 0, fields: 'id,created_by,topic' },
    useNext: false
  })

  return {
    props: {
      tests: tests.data?.results,
      completedTopics: completedTopics?.data?.results
    },
    // revalidate: 10,
  }
}

Tests.PageLayout = CourseWrapper
export default Tests