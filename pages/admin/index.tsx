import CustomCol from '@/components/common/CustomCol'
import WrapperBox from '@/components/common/WrapperBox'
import { makeRequestOne } from '@/config/config'
import { API_ENDPOINTS, DASHBOARD_ICON_SIZE, DASHBOARD_ICON_STROKE, DASHBOARD_STAT_COL_SIZES, LOCAL_STORAGE_KEYS } from '@/config/constants'
import { Stats } from '@/config/types'
import AdminWrapper from '@/layouts/AdminWrapper'
import { useAppContext } from '@/providers/appProvider'
import { DonutChart } from '@mantine/charts'
import { ActionIcon, Box, ColorSwatch, Grid, Group, Stack, Text, Title, em } from '@mantine/core'
import { IconArticle, IconBuildingStore, IconCategory, IconForms, IconReceipt, IconShoppingBag, IconStar, IconUserStar, IconUsersGroup } from '@tabler/icons-react'
import React, { ReactNode, useEffect, useState } from 'react'

export interface IDashboardStat {
  title: string
  icon: ReactNode
  color: string
  value: string
  rightSectionText?: string
  orderTopDown?: boolean
}

export const DashboardStat = (props: IDashboardStat) => {
  const { title, value, icon, color, rightSectionText, orderTopDown } = props

  return (
    <WrapperBox color={color}>
      {
        orderTopDown ? (
          <Stack gap={20}>
            <Group align='center'>
              <ActionIcon mx={'auto'} color={color} size={52} variant='light' radius={'md'}>
                {icon}
              </ActionIcon>
            </Group>
            <Text mt={'sm'} fw={500} size='42px' ta={'center'} lh={em(1.5)}>{value}</Text>
            <Text ta={'center'} fw={700} size='md'>{title}</Text>
            <Stack gap={20} align='center'>
              <Group align='baseline' justify='space-between'>
                <Text size='xs' fw={500} lh={em(1.5)}>{rightSectionText}</Text>
              </Group>
            </Stack>
          </Stack>
        ) : (
          <Group>
            <ActionIcon color={color} size={52} variant='light' radius={'md'}>
              {icon}
            </ActionIcon>
            <Stack gap={20} flex={1}>
              <Text fw={500} size='md'>{title}</Text>
              <Group align='baseline' justify='space-between'>
                <Text fw={700} size='xl' lh={em(1.5)}>{value}</Text>
                <Text size='xs' fw={500} lh={em(1.5)}>{rightSectionText}</Text>
              </Group>
            </Stack>
          </Group >
        )
      }
    </WrapperBox >
  )
}


interface IDonutData {
  name: string
  value: number
  color: string
}

interface ICustomDonutChart {
  data: IDonutData[]
  color: string
  title: string
}

const CustomDonutChart = (props: ICustomDonutChart) => {
  const { title, data, color } = props

  return (
    <WrapperBox color={color}>
      <Stack gap={10}>
        <Title order={3}>{title}</Title>
        <Grid>
          <CustomCol span={6}>
            <DonutChart paddingAngle={10} tooltipDataSource='segment' data={data} />
          </CustomCol>
          <CustomCol span={6}>
            <Stack gap={4} className='h-100' justify='end'>
              {
                data?.map((item, i) => (
                  <Group key={`${title}_${color}_${i}`}>
                    <ColorSwatch radius={'md'} size={26} variant='outline' color={item.color} />
                    <Text size='sm' fw={500} tt={'capitalize'}>{item.value} {item.name}</Text>
                  </Group>
                ))
              }
            </Stack>
          </CustomCol>
        </Grid>
      </Stack>
    </WrapperBox>
  )
}

const Dashboard = () => {
  const { token } = useAppContext()
  const [userInfo, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats>()

  const { user } = useAppContext()



  const loadStats = () => {
    if (token) {
      makeRequestOne({
        url: API_ENDPOINTS.APP_STATS,
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

  return (
    <div>
      <Stack>
        <Stack gap={2}>
          <Title>Dashboard</Title>
          <Text size='md' fw={500}>Welcome back {userInfo?.username},</Text>
        </Stack>
        <Grid>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Users" value={stats?.users?.total?.toString()!!} icon={<IconUsersGroup stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
          </CustomCol>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Merchants" value={stats?.merchants?.toString()!!} icon={<IconBuildingStore stroke={DASHBOARD_ICON_STROKE}
              size={DASHBOARD_ICON_SIZE} />}
              color='yellow'
            />
          </CustomCol>
          {/* <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Products" value={stats?.products?.toString()!!} icon={<IconShoppingBag stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='green' />
          </CustomCol>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Orders" value={stats?.orders?.toString()!!} icon={<IconReceipt size={DASHBOARD_ICON_SIZE} />} color='violet' />
          </CustomCol> */}
          {/* <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Counties" value={stats?.counties?.toString()!!} icon={<IconLocation stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='blue' />
          </CustomCol> */}
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Contact Form Entries"
              value={stats?.contact_form_entries?.total?.toString()!!} icon={<IconForms stroke={DASHBOARD_ICON_STROKE}
                size={DASHBOARD_ICON_SIZE} />} color='pink' rightSectionText={`${stats?.contact_form_entries?.read?.toString()}/${stats?.contact_form_entries?.total?.toString()} read`} />
          </CustomCol>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Subscribers" value={stats?.subscribers?.toString()!!} icon={<IconUserStar stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
          </CustomCol>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Reviews" value={stats?.reviews?.toString()!!} icon={<IconStar stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='indigo' />
          </CustomCol>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Blogs" value={stats?.blogs?.toString()!!} icon={<IconArticle stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='green' />
          </CustomCol>
          <CustomCol span={DASHBOARD_STAT_COL_SIZES}>
            <DashboardStat title="Categories" value={stats?.categories?.toString()!!} icon={<IconCategory stroke={DASHBOARD_ICON_STROKE} size={DASHBOARD_ICON_SIZE} />} color='green' />
          </CustomCol>
        </Grid>
        <Box mt={60}>
          <Grid>
            <CustomCol span={{ md: 6 }}>
              <CustomDonutChart
                title="Gender Distribution"
                color='indigo'
                data={[
                  { color: 'green', name: 'Female', value: stats?.users?.female ?? 0 },
                  { color: 'orange', name: 'Male', value: stats?.users?.male ?? 0 },
                  { color: 'gray', name: 'Not Say', value: stats?.users?.prefer_not_say ?? 0 }
                ]}
              />
            </CustomCol>
            <CustomCol span={{ md: 6 }}>
              <CustomDonutChart
                title="Contact Form"
                color='pink'
                data={[
                  { color: 'green', name: 'Read', value: stats?.contact_form_entries?.read ?? 0 },
                  { color: 'orange', name: 'UnRead', value: stats?.contact_form_entries?.unread ?? 0 }
                ]}
              />
            </CustomCol>
          </Grid>
        </Box>
      </Stack>
    </div>
  )
}


export async function getServerSideProps(context: any) {
  const cookies = context.req.cookies
  const userDetails_: any = cookies[LOCAL_STORAGE_KEYS.user]

  const token = cookies[LOCAL_STORAGE_KEYS.token]

  const userDetails: any = JSON.parse(userDetails_ ?? "{}")

  return {
    props: {

    }
  }
}

Dashboard.PageLayout = AdminWrapper

export default Dashboard