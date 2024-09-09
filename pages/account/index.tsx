import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '@/config/constants'
import AccountWrapper from '@/layouts/AccountWrapper'
import { Stack, Title, Grid, Text, Box } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { makeRequestOne } from '@/config/config'
import { useAppContext } from '@/providers/appProvider'
import InstitutionCard from '@/components/institutions/InstitutionCard'
import CourseCardVertical from '@/components/courses/CourseCardVertical'

interface IAccountDashboard {
  userDetails?: any,
  institutions?: any,
  enrollments?: any
}


const AccountDashboard = ({ userDetails, institutions, enrollments }: IAccountDashboard) => {
  const { token, user, user_id } = useAppContext()
  const [userInfo, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>()

  const loadStats = () => {
    if (token) {
      makeRequestOne({
        url: API_ENDPOINTS.USER_STATS,
        method: 'GET',
        extra_headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res: any) => {
        setStats(res?.data)
      }).catch((err: any) => {
        // console.error(err)
      })
    }
  }

  useEffect(() => {
    setUser(user)
  }, [user])

  useEffect(() => {
    loadStats()
  }, [])

  console.log(institutions)


  return (
    <div>
      <Stack gap={30}>
        <Stack gap={2}>
          <Title>Dashboard</Title>
          <Text size='md' fw={500}>{`Welcome back @${userDetails?.username}`},</Text>
        </Stack>
        {/* <Grid>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Courses" value={stats?.referrals?.toString() ?? '0'} icon={<IconUserCog stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
          </CustomCol>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Completed Courses" value={stats?.contact_form_entries?.toString() ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
          </CustomCol>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Topics" value={stats?.contact_form_entries?.toString() ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
          </CustomCol>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Tests" value={stats?.contact_form_entries?.toString() ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
          </CustomCol>
        </Grid> */}
        {
          enrollments?.length > 0 ? (
            <Box>
              <Title order={2} fw={400} mb="sm">Enrolled Courses</Title>
              <Grid>
                {
                  enrollments?.map((enrollment: any) => (
                    <Grid.Col key={`course_${enrollment?.id}`} span={{ lg: 2, md: 4, sm: 6, xs: 6 }} >
                      <CourseCardVertical {...enrollment.course} cohort={enrollment?.cohort?.title} />
                    </Grid.Col>
                  ))
                }
              </Grid>
            </Box>
          ) : null
        }
        {
          institutions?.length > 0 ? (
            <Box>
              <Title mb={'sm'} fw={400} size={22}>Linked Institutions</Title>
              <Grid>
                {
                  institutions?.map((institution: any, i: number) => (
                    <Grid.Col span={{ lg: 2, md: 4 }} key={`institution_${institution.id}`}>
                      <InstitutionCard institution={institution} />
                    </Grid.Col>
                  ))
                }
              </Grid>
            </Box>
          ) : null
        }
      </Stack>
    </div>
  )
}


export async function getServerSideProps(context: any) {
  const cookies = context.req.cookies
  const userDetails_: any = cookies[LOCAL_STORAGE_KEYS.user]

  const token = cookies[LOCAL_STORAGE_KEYS.token]

  const userDetails: any = JSON.parse(userDetails_ ?? "{}")

  try {

    const userInstitutions = await makeRequestOne(
      {
        url: `${API_ENDPOINTS.USER_INSTITUTIONS}/${userDetails?.id}`,
        method: "GET",
        extra_headers: {
          authorization: `Bearer ${token}`
        },
        params: {
          // created_by__id: userDetails?.id,
          fields: 'id,institution,banner,name,slug,logo'
        }
      }
    )

    const enrollmentsQuery = await makeRequestOne(
      {
        url: API_ENDPOINTS.ENROLLMENTS,
        method: "GET",
        params: { student: userDetails?.student ?? 0, fields: "id,student,course,cohort,title,slug,banner,description" },
        extra_headers: {
          authorization: `Bearer ${token}`
        }
      }
    )


    return {
      props: {
        userDetails,
        institutions: userInstitutions.data?.institutions ?? [],
        enrollments: enrollmentsQuery?.data.results,
      }
    }
  } catch (err) {
    return {
      props: {

      }
    }
  }
}

AccountDashboard.PageLayout = AccountWrapper

export default AccountDashboard