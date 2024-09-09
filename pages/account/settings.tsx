import CreateUserForm from '@/components/forms/CreateUserForm'
import ChangePasswordForm from '@/components/forms/more_forms/ChangePasswordForm'
import ProfilePhotoForm from '@/components/forms/more_forms/ProfilePhotoForm'
import WrapperBox from '@/components/common/WrapperBox'
import { LOCAL_STORAGE_KEYS } from '@/config/constants'
import AccountWrapper from '@/layouts/AccountWrapper'
import { Container, Stack, Title } from '@mantine/core'
import React, {  } from 'react'

interface IProfileSettings {
  user?: any
}

const ProfileSettings = (props: IProfileSettings) => {
  const { user } = props


  // const loadAgent = () => {
  //   if (user?.agent) {
  //     makeRequestOne({
  //       url: `${API_ENDPOINTS.AGENTS}/${user?.agent}`, method: 'GET',
  //       extra_headers: {
  //         authorization: `Bearer ${token}`
  //       },
  //       useNext: false,
  //     }).then((res: any) => {
  //       setAgent(res?.data)
  //     }).catch(() => { })
  //   }
  // }


  return (
    <Container size={'md'}>
      <Stack>
        <Title>Profile Settings</Title>
        <WrapperBox color="blue">
          <Stack>
            <Title order={2}>Profile Photo</Title>
            <ProfilePhotoForm updating={false} />
          </Stack>
        </WrapperBox>
        <WrapperBox color="blue">
          <Stack>
            <Title order={2}>Update Account Information</Title>
            {
              (!user?.farmer && !user?.agent) ? (
                <CreateUserForm updating={true} data={user} hideTitle={true} />
              ) : null
            }
          </Stack>
        </WrapperBox>
        <WrapperBox color="blue">
          <Stack>
            <Title order={2}>Password Settings</Title>
            <ChangePasswordForm updating={false} />
          </Stack>
        </WrapperBox>
      </Stack>
    </Container>
  )
}


export async function getServerSideProps(context: any) {
  const cookies = context.req.cookies
  const userDetails_: any = cookies[LOCAL_STORAGE_KEYS.user]

  const token = cookies[LOCAL_STORAGE_KEYS.token]

  const userDetails: any = JSON.parse(userDetails_ ?? "{}")
  return {
    props: {
      user: userDetails
    }
  }
}

ProfileSettings.PageLayout = AccountWrapper

export default ProfileSettings