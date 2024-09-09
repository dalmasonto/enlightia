import React from 'react'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'
import CohortForm from '@/components/courses/CohortForm'
import { useRouter } from "next/router"
import SEOHeader from '@/components/seo/SEOHeader'
import { Stack, Title } from '@mantine/core'

const AddCohort = () => {
  const { query } = useRouter()

  return (
    <div>
      <SEOHeader
        url={''}
        title={'Add New Cohort'}
        description={''}
        keywords={''}
        image={''}
        twitter_card={''} />
      <Stack>
        <Title fw={500} order={2}>Add Cohort</Title>
        <Stack>
          <CohortForm updating={false} courseID={query?.cid?.toString()!!} />
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


    return {
      props: {

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


AddCohort.PageLayout = InstitutionWrapper
export default AddCohort