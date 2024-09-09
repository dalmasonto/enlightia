import { Requests } from "@/components/account/Requests"
import InstitutionCard from "@/components/institutions/InstitutionCard"
import { makeRequestOne } from "@/config/config"
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from "@/config/constants"
import { displayErrors } from "@/config/functions"
import AccountWrapper from "@/layouts/AccountWrapper"
import { useAppContext } from "@/providers/appProvider"
import { Container, Button, Group, Text, Title, Stack, Box, Grid, Alert } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { IconAlertCircle, IconAlertTriangle } from "@tabler/icons-react"
import { useEffect, useState } from "react"

const RegisterAsInstructorButton = () => {

  const { token, user, logout } = useAppContext()

  const CAN_REGISTER_INSTRUCTOR = user?.profile?.can_register_instructor
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const form = useForm({
    initialValues: {
      email: null,
      user: null,
    }
  })

  const handleRegister = () => {
    setLoading(true)
    makeRequestOne({
      url: API_ENDPOINTS.ALL_INSTRUCTORS,
      method: 'POST',
      data: {
        user: user?.id,
        email: user?.email
      },
      extra_headers: {
        authorization: `Bearer ${token}`
      },
      useNext: false
    }).then((res: any) => {
      showNotification({
        title: "Success",
        message: "You are now a registered instructor.",
        color: "green",
        icon: <IconAlertCircle stroke={1.5} />
      })
      logout && logout()
    }).catch((error) => {
      const errors = error?.response?.data
      displayErrors(form, errors)

      showNotification({
        title: "Error",
        message: "Something went wrong",
        color: "red",
        icon: <IconAlertTriangle stroke={1.5} />
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <>
      {
        loaded ? (
          <div>
            {
              CAN_REGISTER_INSTRUCTOR ? (
                <>
                  <Button onClick={handleRegister} loading={loading} radius={'xl'} w={'200px'} variant="filled">
                    Register
                  </Button>
                </>
              ) : (
                <Alert title="Note" radius={'lg'} color="yellow">
                  <Text>You are not allowed to register as an instructor</Text>
                </Alert>
              )
            }
            {
              Object.keys(form.errors).map((field: string, i: number) => (
                <Group key={`error_${i}`} align='center'>
                  <Text size="sm">{field}</Text>
                  <Text size="sm" color='red'>{form.errors[field]}</Text>
                </Group>
              ))
            }
          </div>
        ) : null
      }
    </>
  )
}

interface IProfile {
  userDetails: any,
  requests: any,
  institutions: any,
}

const InstructorProfile = ({ userDetails, requests, institutions }: IProfile) => {
  const user = userDetails
  const instructor = userDetails?.instructor

  return (
    <div>
      <Container fluid size="xl">
        <Stack gap={30}>
          <Box>
            <Title order={2} fw={500}>Instructor Profile</Title>
            <Text fw={500}>{`Welcome back @${user?.username}`}</Text>
            <Text mt='lg'>
              This is your instructor profile. From this profile, you can be able to see all the linked institutions to your account where you are referenced as an instructor.
            </Text>
          </Box>
          <Box>
            {
              !instructor ?
                <RegisterAsInstructorButton />
                :
                null
            }
          </Box>
          {
            requests?.length > 0 ? (
              <Box>
                <Title fw={400} mb="md" size={22}>Invites to be an Admin Or an Instructor</Title>
                <Requests requests={requests} userID={user?.id ?? 0} instructorID={user?.instructor} />
              </Box>
            ) : null
          }
          {
            institutions?.length > 0 ? (
              <Box>
                <Title mb={10} fw={400} size={22}>Linked Institutions</Title>
                <Grid>
                  {
                    institutions?.map((institution: any, i: number) => (
                      <Grid.Col span={{ lg: 2, md: 4 }} key={`institution_other_${institution.id}`}>
                        <InstitutionCard institution={institution} />
                      </Grid.Col>
                    ))
                  }
                </Grid>
              </Box>
            ) : null
          }
        </Stack>
      </Container>
    </div>
  )
}


export const getServerSideProps = async (context: any) => {
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

    const requestsQuery = await makeRequestOne(
      {
        url: API_ENDPOINTS.REQUESTS,
        method: "GET",
        params: { email: userDetails?.email, fields: "id,institution,status,read,email,created_on,name,target" },
        extra_headers: {
          authorization: `Bearer ${token}`
        }
      }
    )

    return {
      props: {
        userDetails,
        institutions: userInstitutions.data?.institutions ?? [],
        requests: requestsQuery?.data?.results ?? [],
      }
    }
  } catch (err) {
    console.log(err)
    return {
      props: {

      }
    }
  }
}

InstructorProfile.PageLayout = AccountWrapper
export default InstructorProfile