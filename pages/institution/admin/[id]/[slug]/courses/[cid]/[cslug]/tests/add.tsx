import React from 'react'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'
import { useRouter } from "next/router"
import SEOHeader from '@/components/seo/SEOHeader'
import { Stack, Title } from '@mantine/core'
import TestForm from '@/components/courses/TestForm'
import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'

interface IAddTest {
  topics: any
  cohorts: any
}

const AddTest = ({ topics, cohorts }: IAddTest) => {
  const { query } = useRouter()

  return (
    <div>
      <SEOHeader
        url={''}
        title={'Add New Test'}
        description={''}
        keywords={''}
        image={''}
        twitter_card={''} />
      <Stack>
        <Title fw={500} order={2}>Add Test</Title>
        <Stack>
          <TestForm updating={false} topics={topics} cohorts={cohorts} cid={query.cid} />
        </Stack>

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

    const plainTopicsQuery = await makeRequestOne({
      url: `${API_ENDPOINTS.TOPICS}`,
      method: 'GET',
      params: {
        fields: "id, title, slug, order", course__id: query.cid,
        // parent__isnull: true 
      },
    })
    const cohortQuery = await makeRequestOne({
      url: `${API_ENDPOINTS.COHORTS}`,
      method: 'GET',
      params: {
        course: query.cid,
        ordering: "-id",
      }
    })

    return {
      props: {
        topics: plainTopicsQuery?.data?.results,
        cohorts: cohortQuery?.data?.results,
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


AddTest.PageLayout = InstitutionWrapper
export default AddTest