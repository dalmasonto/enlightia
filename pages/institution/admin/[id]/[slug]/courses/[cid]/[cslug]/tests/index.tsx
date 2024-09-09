import React from 'react'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'
import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { Stack, Title } from '@mantine/core'
import SEOHeader from '@/components/seo/SEOHeader'
import { useRouter } from "next/router"
import NoDataFound from "@/components/errors/NoDataFound"
import TestForm from '@/components/courses/TestForm'

interface ITests {
  tests: any
  topics: any
  cohorts: any
  error: boolean
}

const Tests = ({ tests, error, topics, cohorts }: ITests) => {
  const { query } = useRouter()
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
        <Title fw={500} order={2}>Tests</Title>
        <Stack>
          {
            tests?.map((test: any, i: number) => (
              <TestForm key={`cohort_${test.id}`} test={test} updating={true} topics={topics} cohorts={cohorts} cid={query.cid} />
            ))
          }
          <NoDataFound visible={tests?.length === 0} description="No Tests found. Add new" />
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
    const testsQuery = await makeRequestOne({
      url: `${API_ENDPOINTS.TESTS}`,
      method: 'GET',
      params: {
        course: query.cid,
        ordering: "-id",
        fields: "id,created_by,title,description,course,cohort,topics,slug"
      }
    })

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
        tests: testsQuery?.data?.results,
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

Tests.PageLayout = InstitutionWrapper
export default Tests