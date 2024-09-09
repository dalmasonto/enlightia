import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import { Paper, Center, Container, Grid, Title, TextInput, Text, Box, Group, Button, Loader, Stack, Anchor, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IconKey, IconAlertCircle, IconAlertTriangle, IconMail } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useAppContext } from '../../../providers/appProvider';
import { isDarkMode, makeRequestOne } from '@/config/config';
import { API_ENDPOINTS, SEPARATOR, APP_NAME } from '@/config/constants';
import { displayErrors } from '@/config/functions';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';
import AuthPageBox from '@/components/auth/AuthPageBox';

const Reset = () => {
  const [loading, setLoading] = useState(false)
  const { login, login_status } = useAppContext()
  const matches = useMediaQuery('(max-width: 992px)');

  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const router = useRouter()

  const form = useForm({
    initialValues: {
      email: '',
    },

    validate: {
      email: (value) => (value === "" || value === null || value === undefined) ? "Your account email is required" : null,
    },
  });

  const handleLogin = () => {
    setLoading(true)
    makeRequestOne({ url: API_ENDPOINTS.REQUEST_PASSWORD_RESET, method: "POST", data: form.values }).then((res: any) => {
      showNotification({
        title: "Password Reset",
        message: "An Email has been successfully sent with further instructions",
        color: "green",
        icon: <IconAlertCircle stroke={1.5} />
      })
    }).catch(err => {
      showNotification({
        title: "Password Reset",
        message: err?.message,
        color: "red",
        icon: <IconAlertTriangle stroke={1.5} />
      })
      const error_data = err?.response?.data
      if (typeof error_data === 'object') {
        displayErrors(form, error_data)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    if (login_status) {
      router.push("/")
    }
  }, [])

  return (
    <>
      <Head>
        <title>{`Account Login ${SEPARATOR} ${APP_NAME}`}</title>
        <meta name="description" content="Log in to your account to get started. List businesses, list products, list services and shop on Sisi markets" />
      </Head>
      <AuthPageBox>
        <Center className='h-100'>
          <Box className='w-100' py="md" size="lg">
            <Container size={"sm"}>
              <Paper className="h-100" style={{ overflow: "hidden" }}
                radius="lg" p={matches ? 20 : 40}
                bg={isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[1]}
              >

                <form onSubmit={form.onSubmit(() => { handleLogin() })}>
                  <Grid>
                    <Grid.Col span={{ md: 12 }} px="md" py="xl" style={{
                      // background: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(/images/login.png)",
                      backgroundSize: "cover"
                    }}>
                      <Stack gap={16}>
                        <Title ta='center' order={2} >Password Reset</Title>
                        <Text ta='center' size="sm" >Reset your password by providing an email below.</Text>
                        <TextInput
                          type='email'
                          autoFocus
                          radius="md"
                          label="Email"
                          placeholder='Enter your email'
                          leftSection={<IconMail stroke={1.5} />}
                          {...form.getInputProps('email')}
                        />

                        <Group justify="apart" style={{ textAlign: "center" }}>
                          <Button size='sm' type="submit" radius="md" style={{ width: "auto" }} rightSection={loading ? <Loader size={16} color="white" /> : <IconKey size={16} />}>Reset Password</Button>
                        </Group>
                        <Center >
                          <Anchor component={Link} href="/auth/login" passHref>
                            <Text size="sm" >Know your password? Login</Text>
                          </Anchor>
                        </Center>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </form>
              </Paper>
            </Container>
          </Box>
        </Center>
      </AuthPageBox>ge.
    </>
  )
}

Reset.PageLayout = HeaderAndFooterWrapper;

export default Reset