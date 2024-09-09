import React from 'react'
import { RequestProps, makeRequestOne } from '../../../../../../config/config'
import { Grid, Stack, Title } from '@mantine/core'
import CourseCardVertical from '../../../../../../components/courses/CourseCardVertical'
import { API_ENDPOINTS } from '@/config/constants'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'

interface ICourses {
  courses: any
}

const Courses = (props: ICourses) => {
  const { courses } = props

  return (
    <div>
      <Stack>
        <Title fw={500}>All Courses</Title>
        <Grid>
          {courses?.map((course: any, i: number) => (
            <Grid.Col key={`course_${i}_${course.id}`} span={{ lg: 2, md: 4, sm: 6, xs: 6 }}>
              <CourseCardVertical {...course} isAdmin={true} />
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </div>
  )
}


export const getServerSideProps = async (ctx: any) => {
  const { params } = ctx
  const reqOptions: RequestProps = {
    url: API_ENDPOINTS.COURSES,
    method: 'GET',
    params: { limit: 50, institution: params.id }
  }

  const coursesQuery = await makeRequestOne(reqOptions)

  return {
    props: {
      courses: coursesQuery.data?.results
    },
  }
}

Courses.PageLayout = InstitutionWrapper
export default Courses