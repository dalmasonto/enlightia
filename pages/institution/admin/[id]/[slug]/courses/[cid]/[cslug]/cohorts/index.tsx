import React from 'react'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'
import { RequestProps, makeRequestOne } from '@/config/config'
import { API_ENDPOINTS } from '@/config/constants'
import { SingleTopicCard } from '@/components/courses/TopicCards'
import { Grid, Stack, Title } from '@mantine/core'
import SEOHeader from '@/components/seo/SEOHeader'
import CohortForm from '@/components/courses/CohortForm'
import { useRouter } from "next/router"
import NoDataFound from "@/components/errors/NoDataFound"

interface ICohorts {
  cohorts: any
  error: boolean
}

const Cohorts = ({ cohorts, error }: ICohorts) => {
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
        <Title fw={500} order={2}>Cohorts</Title>
        <Stack>
          {
            cohorts?.map((cohort: any, i: number) => (
              <CohortForm key={`cohort_${cohort.id}`} cohort={cohort} updating={true} courseID={query?.cid?.toString()!!} />
            ))
          }
          <NoDataFound visible={cohorts?.length === 0} description="No cohorts found. Add new" />
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

Cohorts.PageLayout = InstitutionWrapper
export default Cohorts