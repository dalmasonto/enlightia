import CustomCol from '@/components/common/CustomCol'
import { DASHBOARD_STAT_COL_SIZES, DASHBOARD_ICON_STROKE, DASHBOARD_ICON_SIZE, API_ENDPOINTS } from '@/config/constants'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'
import { DashboardStat } from '@/pages/admin'
import { useAppContext } from '@/providers/appProvider'
import { Box, Grid, Stack, Title } from '@mantine/core'
import { IconUserCog, IconForms } from '@tabler/icons-react'
import useSWR from 'swr'
import { formatNumber, makeRequestOne } from "@/config/config"
import { useRouter } from 'next/router'

const Institution = () => {
  const { token } = useAppContext();
  const { query } = useRouter()

  const { data, error, mutate } = useSWR({
    url: `${API_ENDPOINTS.INSTITUTIONS}/${query?.id}`, method: 'GET',
    extra_headers: { AUTHORIZATION: `Bearer ${token}` },
    params: {
      fields: ''
    }, useNext: false
  }, makeRequestOne)

  const institution: any = data?.data
  const stats: any = institution?.stats

  return (
    <Stack gap={20}>
      <Title order={2}>Dashboard</Title>
      <Grid>
        <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
          <DashboardStat orderTopDown={true} title="Courses" value={formatNumber(stats?.courses ?? 0) ?? '0'} icon={<IconUserCog stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
        </CustomCol>
        <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
          <DashboardStat orderTopDown={true} title="Admins" value={formatNumber(stats?.admins ?? 0) ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='violet' />
        </CustomCol>
        <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
          <DashboardStat orderTopDown={true} title="Instructors" value={formatNumber(stats?.instructors ?? 0) ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='blue' />
        </CustomCol>
        <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
          <DashboardStat orderTopDown={true} title="Students" value={formatNumber(stats?.students ?? 0) ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='lime' />
        </CustomCol>
        <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
          <DashboardStat orderTopDown={true} title="Tests" value={formatNumber(stats?.tests ?? 0) ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='teal' />
        </CustomCol>
        <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
          <DashboardStat orderTopDown={true} title="Test Submissions" value={formatNumber(stats?.test_submissions ?? 0) ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='green' />
        </CustomCol>
        <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
          <DashboardStat orderTopDown={true} title="Cohorts" value={formatNumber(stats?.cohorts ?? 0) ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='cyan' />
        </CustomCol>
        <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
          <DashboardStat orderTopDown={true} title="Contact" value={formatNumber(stats?.contact ?? 0) ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='orange' />
        </CustomCol>
        <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
          <DashboardStat orderTopDown={true} title="Reviews" value={formatNumber(stats?.reviews ?? 0) ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='yellow' />
        </CustomCol>
        <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
          <DashboardStat orderTopDown={true} title="Media Files" value={formatNumber(stats?.media_files ?? 0) ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
        </CustomCol>
        <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
          <DashboardStat orderTopDown={true} title="Events" value={formatNumber(stats?.events ?? 0) ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
        </CustomCol>
        <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
          <DashboardStat orderTopDown={true} title="Resources" value={formatNumber(stats?.resources ?? 0) ?? '0'} icon={<IconForms stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
        </CustomCol>
      </Grid>
      {/* <Box>
        <Grid>
          <Grid.Col span={{ md: 6 }}>
            <Title order={2} fw={500}>Recent Students</Title>

          </Grid.Col>
          <Grid.Col span={{ md: 6 }}>
            <Title order={2} fw={500}>Recent Courses</Title>

          </Grid.Col>
        </Grid>
      </Box> */}
    </Stack>
  )
}
Institution.PageLayout = InstitutionWrapper
export default Institution