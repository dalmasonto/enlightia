import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import { Paper, Center, Container, Title, TextInput, Text, Box, PasswordInput, Group, Loader, Stack, Button, Anchor, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useMediaQuery } from '@mantine/hooks';
import { useAppContext } from '../../providers/appProvider';
import { API_ENDPOINTS, SEPARATOR, APP_NAME } from '@/config/constants';
import { isDarkMode, makeRequestOne } from '@/config/config';
import { displayErrors } from '@/config/functions'
import { IconUser, IconPassword, IconLogin } from '@tabler/icons-react';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';
import AuthPageBox from '@/components/auth/AuthPageBox';

const Login = () => {
  const [loading, setLoading] = useState(false)
  const { login, login_status } = useAppContext()
  const matches = useMediaQuery('(max-width: 992px)');
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const router = useRouter()

  const form = useForm({
    initialValues: {
      username: '',
      password: "",
    },

    validate: {
      username: (value) => (value === "" || value === null || value === undefined) ? "Enter username" : null,
      password: (value) => (value === "" || value === null || value === undefined) ? "Enter password" : null,
    },
  });

  const handleLogin = () => {
    setLoading(true)
    makeRequestOne({ url: API_ENDPOINTS.LOGIN, method: "POST", data: form.values, useNext: false, params: { fields: 'id,email,full_name,first_name,last_name,username,is_superuser,profile,phone_number,avatar,student,instructor,can_register_student,can_register_instructor,can_register_institution' } }).then((res: any) => {
      login(res?.data?.user, res?.data?.token)
      router.push('/account')
    }).catch(error => {
      showNotification({
        title: "Account Login",
        message: "Login failed, please try again with correct credentials",
        color: "red"
      })
      const error_data = error?.data
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
                <form onSubmit={form.onSubmit((values) => { handleLogin() })}>
                  <Stack gap={16}>
                    <Title ta='center' order={2} >Login</Title>
                    <Text ta='center' size="sm" >Login to your account</Text>
                    <TextInput
                      autoFocus
                      radius="md"
                      label="Username"
                      placeholder='Enter username'
                      leftSection={<IconUser size={16} />}
                      {...form.getInputProps('username')}
                    />
                    <PasswordInput
                      size='sm'
                      radius="md"
                      label="Password"
                      placeholder="Enter password"
                      leftSection={<IconPassword size={16} />}
                      {...form.getInputProps('password')}
                    />

                    <Group justify="space-between" style={{ textAlign: "center" }}>
                      <Button rightSection={loading ? <Loader color='white' size={16} /> : <IconLogin size={16} />} type='submit' >
                        Submit
                      </Button>
                      <Anchor component={Link} href="/auth/password/reset" style={{ fontWeight: 400 }} size="sm" >Forgot password? Reset</Anchor>
                    </Group>
                    <Center >
                      <Anchor component={Link} href={'/auth/sign-up'} size="sm" style={{ fontWeight: 400 }} >Don&apos;t have an account? Create Account</Anchor>
                    </Center>
                  </Stack>
                </form>
              </Paper>
            </Container>
          </Box>
        </Center>
      </AuthPageBox>
    </>
  )
}

Login.PageLayout = HeaderAndFooterWrapper;

export default Login
