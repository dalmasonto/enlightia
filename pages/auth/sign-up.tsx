import { Box, Container, Stack } from '@mantine/core';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';
import Head from 'next/head';
import { APP_NAME } from '@/config/constants';
import { useForm } from '@mantine/form';
import CreateUserForm from '@/components/forms/CreateUserForm';
import AuthPageBox from '@/components/auth/AuthPageBox';

function HomePage() {
  const form = useForm({
    initialValues: {
      activeTab: 'farmer'
    }
  })
  return (
    <>
      <Head>
        <title>{`${APP_NAME} - Home`}</title>
      </Head>
      <AuthPageBox>
        <Container size={'md'} py={100}>
          <Stack>
            <CreateUserForm />
          </Stack>
        </Container>
      </AuthPageBox>
    </>
  );
}


HomePage.PageLayout = HeaderAndFooterWrapper

export default HomePage