import { Box, Center, Container, Grid, Group, Image, Stack, Text, Title, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';
import Head from 'next/head';
import { API_ENDPOINTS, APP_NAME } from '@/config/constants';
import { RequestProps, isDarkMode, makeRequestOne } from '@/config/config';
import CourseCardVertical, { CourseProps } from '@/components/courses/CourseCardVertical';
import { Welcome } from '@/components/Welcome/Welcome';
import SEOHeader from '@/components/seo/SEOHeader';
import HeroQuickCards from '@/components/pages/HeroQuickCards';
import HomePlayerIcon from '@/components/pages/HomePlayerIcon';

interface IHomePage {
  faqs?: any
  reviews?: any
  articles?: any
  newsletters?: any[]
  courses?: any
}

function HomePage(props: IHomePage) {
  const { faqs, reviews, articles, newsletters, courses } = props
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()


  return (
    <>
      <SEOHeader url={"/"}
        title={"Home"}
        description={"All courses provided in Enlightia"}
        keywords={"coding, learn how to code"} image={""}
        twitter_card={""}
      />
      <Container py={'md'} size={'xl'}>
        <Grid>
          <Grid.Col span={{ md: 6 }}>
            <Center h={'100%'}>
              <Welcome />
            </Center>
            <Center style={{ position: 'relative' }}>
              <div className={'circles'} >
                <div className={'circle1'}></div>
                <div className={'circles2'}></div>
                <div className={'circles3'}></div>
              </div>
              <HomePlayerIcon />
            </Center>
          </Grid.Col>
          <Grid.Col span={{ md: 6 }}>
            <Center py={'50px'}>
              <Image src={`/static/images/img.png`} w={'70%'} />
            </Center>
          </Grid.Col>
        </Grid>
      </Container>
      <Box bg={isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[2]}>
        <Container py={'xl'} size={'xl'} mt={'50px'}>
          <HeroQuickCards />
        </Container>
      </Box>
      <Container py={'xl'} fluid size={'xl'} mt={'50px'}>
        <Stack gap={20}>
          <Title order={2} size={'52px'} fw={500} ta={'center'}>Explore Our Courses</Title>
          <Text ta={'center'} maw={"800px"} mx={'auto'}>
            Discover a wide range of courses tailored to help you achieve your learning goals. From beginner to advanced levels, our expertly crafted courses ensure a comprehensive and engaging educational experience.
          </Text>
          <Grid w={'100%'} mt={'30px'}>
            <Grid.Col span={12}>
              <Grid justify='center'>
                {courses?.map((course: CourseProps, i: number) => (
                  <Grid.Col key={`blog_site_${i}`} span={{ lg: 2, md: 4, sm: 6, xs: 6 }}>
                    <CourseCardVertical {...course} />
                  </Grid.Col>
                ))}
              </Grid>
              {
                courses?.length === 0 && (
                  <Title order={3} size={32} fw={400}>There are no registered courses so far</Title>
                )
              }
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}


export async function getServerSideProps(context: any) {
  // const cookies = context.req.cookies
  // const userDetails_: any = cookies[LOCAL_STORAGE_KEYS.user]

  // const token = cookies[LOCAL_STORAGE_KEYS.token]

  // const userDetails: any = JSON.parse(userDetails_ ?? "{}")

  try {

    const reqOptions: RequestProps = {
      method: "GET",
      url: `${API_ENDPOINTS.COURSES}`,
      params: { limit: 25, fields: 'id,title,slug,description,banner' }
    }
    const coursesQuery = await makeRequestOne(reqOptions)
    return {
      props: {
        courses: coursesQuery?.data.results
      }
    }
  } catch (err) {
    return {
      props: {
        courses: []
      }
    }
  }
}

HomePage.PageLayout = HeaderAndFooterWrapper

export default HomePage

