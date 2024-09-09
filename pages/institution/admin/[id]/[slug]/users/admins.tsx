import React, { useState } from 'react'
import { Avatar, Box, Button, Group, Stack, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { RequestProps, makeRequestOne, toDate } from '../../../../../../config/config'
import { displayErrors } from '../../../../../../config/functions'
import { useRouter } from 'next/router'
import { useAppContext } from '../../../../../../providers/appProvider'
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '@/config/constants'
import { IconCheck, IconAlertTriangle, IconSend } from '@tabler/icons-react'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'
import { modals } from '@mantine/modals'

const InviteInstructor = () => {
  const [loading, setLoading] = useState(false)
  const { query } = useRouter()
  const { token, user_id } = useAppContext()

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: value => value.length < 4 ? "Enter a valid email" : null
    }
  })

  const handleSendInvite = () => {
    const requestOptions: RequestProps = {
      url: `${API_ENDPOINTS.REQUESTS}`,
      method: "POST",
      extra_headers: {
        authorization: `Bearer ${token}`
      },
      data: {
        ...form.values,
        created_by: user_id,
        institution: query.id,
        target: 'admin'
      },
      params: {},
      useNext: false
    }
    setLoading(true)
    makeRequestOne(requestOptions).then((res: any) => {
      showNotification({
        message: "Invite Successfully sent!",
        color: "green",
        icon: <IconCheck />
      })
      modals.closeAll()
    }).catch((error) => {
      const errors = error?.response?.data
      displayErrors(form, errors)
      showNotification({
        title: 'Error',
        message: error?.message,
        color: 'red',
        icon: <IconAlertTriangle stroke={1.5} />,
      })
    }).finally(() => {
      setLoading(false)
    })
  }
  return (
    <Stack>
      <Title order={2}>Invite Admin</Title>
      <form onSubmit={form.onSubmit((values) => handleSendInvite())}>
        <Stack className='h-100' justify='center'>
          <TextInput label={'Email'} radius={'md'} placeholder='Enter email of the admin' {...form.getInputProps('email')} />
          <Button type='submit' radius={'xl'} leftSection={<IconSend />} loading={loading}>Send Invite</Button>
        </Stack>
      </form>
    </Stack>
  )
}

const Admins = () => {
  const { query } = useRouter()
  return (
    <div>
      <Stack>
        <Box>
          <Title>Admins</Title>
          <Text size="sm">Those who accepted the admin invites.</Text>
        </Box>
        <CustomDataTable
          url={API_ENDPOINTS.INSTITUTION_ADMINS}
          method={'GET'}
          defaultFilters={{
            page: 1,
            limit: '10',
            ordering: 'id',
            search: "",
            institution__id: query?.id,
            fields: "user,full_name, email, username, profile, avatar, phone_number, date_joined, last_login, is_active"
          }}
          useNext={false}
          formValidators={undefined}
          hideUpdateActionBtn={false}
          hideDeleteActionBtn
          hideActionsColumn={true}
          updateData={{
            formNode: InviteInstructor,
            modalSize: 'lg',
            updatingModalTitle: "Invite Instructor",
            deletingModalTitle: "Delete Invite",
            extraFormProps: {
              is_admin: true
            }
          }}
          columns={[
            {
              accessor: 'id',
              title: '#',
              width: '80px',
              textAlign: 'center',
              render: (item: any, i: number) => (
                <>{i + 1}</>
              )
            },
            {
              accessor: "name",
              title: "Name",
              width: "300px",
              render: (item: any) => (
                <Group p={0} style={{
                  cursor: "pointer"
                }} wrap='nowrap'>
                  <Avatar radius="md" src={item?.user?.profile?.avatar} alt={item?.user?.full_name} />
                  <Stack gap={2}>
                    <Text size="sm">{item?.user?.full_name}</Text>
                    <Text size="xs" c={'dimmed'}>{item?.user?.email}</Text>
                    <Text size="sm">{item?.user?.username}</Text>
                  </Stack>
                </Group>
              )
            },
            {
              accessor: 'user.profile.phone_number',
              title: 'Phone Number',
              width: '180px',
            },
            {
              accessor: 'is_active',
              title: 'Is Active',
              width: '180px',
              render: (item: any) => (
                <Button size="xs" w={'80px'} variant="light" radius={'xl'} color={item?.user?.is_active ? 'green' : 'yellow'}>{item?.user?.is_active ? 'Yes' : 'No'}</Button>
              )
            },
            {
              accessor: 'date_joined',
              title: 'Registered On',
              width: '250px',
              render: (item: any) => (
                <Text size='sm'>{toDate(item?.user?.date_joined, true)}</Text>
              )
            },
            {
              accessor: 'last_login',
              title: 'Last Login',
              width: '250px',
              render: (item: any) => (
                <Text size='sm'>{toDate(item?.user?.last_login, true)}</Text>
              )
            }
          ]}
          filterFields={[
            {
              accessor: 'limit',
              label: 'Limit',
              gridSize: 2,
              placeholder: '23',
              type: 'select',
              options: [
                { value: '2', label: '2' },
                { value: '5', label: '5' },
                { value: '10', label: '10' },
                { value: '15', label: '15' },
                { value: '20', label: '20' },
                { value: '50', label: '50' },
                { value: '100', label: '100' },
              ]
            },
            {
              accessor: 'search',
              label: 'Search',
              gridSize: 2,
              placeholder: 'Search by name, email, username, phone number',
              type: 'text'
            },
            {
              accessor: 'ordering',
              label: 'Ordering',
              gridSize: 2,
              placeholder: '23',
              type: 'select',
              options: [
                {
                  group: 'Ascending',
                  items: [
                    { value: 'id', label: 'ID' },
                    { value: 'first_name', label: 'First NameName' },
                  ]
                },
                {
                  group: 'Descending',
                  items: [
                    { value: '-id', label: 'ID' },
                    { value: '-first_name', label: 'First Name' },
                  ]
                }
              ]
            },
          ]}
        />
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

Admins.PageLayout = InstitutionWrapper

export default Admins
