import React, { } from 'react'
import { RequestProps, makeRequestOne } from '../../../../../../../../config/config'
import { GetServerSidePropsContext } from 'next'
import { Grid, Stack, Title } from '@mantine/core'
import AddCourseForm from '../../../../../../../../components/courses/AddCourseForm'
import { API_ENDPOINTS } from '@/config/constants'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'



interface ISingleCourseUpdate {
    course: any
    topics: any
}

const SingleCourseUpdate = (props: ISingleCourseUpdate) => {

    const { course } = props

    return (
        <div>
            <Grid>
                <Grid.Col span={{ md: 12 }}>
                    <Stack>
                        <Title order={2}>Course Details</Title>
                        <AddCourseForm updating={true} data={{ ...course }} />
                    </Stack>
                </Grid.Col>
            </Grid>
        </div>
    )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const query = ctx.query
    const courseQuery = await makeRequestOne({
        url: `${API_ENDPOINTS.COURSES}/${query.cid}`,
        method: 'GET',
        params: { fields: "id,title,slug,description,banner,notes" }
    })
    // const topicsQuery = await makeRequestOne({
    //     url: `${API_ENDPOINTS.TOPICS}`,
    //     method: 'GET',
    //     params: {
    //         fields: "id, title,slug,subtopics,period,order", course__id: query.cid,
    //         parent__isnull: true
    //     },
    // })

    return {
        props: {
            course: courseQuery.data,
            // topics: topicsQuery?.data?.results,
        },
    }
}

SingleCourseUpdate.PageLayout = InstitutionWrapper
export default SingleCourseUpdate