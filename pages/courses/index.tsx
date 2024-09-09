import CourseCardVertical from "@/components/courses/CourseCardVertical";
import SEOHeader from "@/components/seo/SEOHeader";
import { RequestProps, isDarkMode, makeRequestOne } from "@/config/config";
import { API_ENDPOINTS, BLUE_DARK_COLOR, containerSize } from "@/config/constants";
import { getTheme } from "@/config/functions";
import HeaderAndFooterWrapper from "@/layouts/HeaderAndFooterWrapper";
import { Card, Stack, Title, Container, Grid, useMantineTheme, useMantineColorScheme, lighten, Text } from "@mantine/core";


interface TeaserCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string,
}

// Respect: We honor the dignity, preferences, and cultural backgrounds of every individual we serve.
const TeaserCard = (props: TeaserCardProps) => {
  const { title, icon, description, color } = props;
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme()

  return (
    <Card p="xl" style={{
      background: isDarkMode(colorScheme) ? BLUE_DARK_COLOR : lighten(color, 0.8),
      borderRadius: theme.radius.lg,
      height: "100%"
    }}>
      <Stack>
        {icon}
        <Title order={2} size={40}>{title}</Title>
        <Text>
          {description}
        </Text>
      </Stack>
    </Card>
  )
}

function IndexPage(props: any) {
  const { courses } = props

  return (
    <div>
      <SEOHeader url={"/"} title={"Courses"} description={"All courses provided in LSD LMS"} keywords={"coding, learn how to code"} image={""} twitter_card={""} />
      {/* <Hero showCards={false} /> */}
      <Container py={100} size={containerSize}>
        <Grid>
          <Grid.Col span={{ md: 4 }}>
            <Grid>
              {courses.map((course: any, i: number) => (
                <Grid.Col key={`blog_site_${i}`} span={{ md: 4, sm: 6, xs: 6 }}>
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
      </Container>
    </div>
  );
}

export const getStaticProps = async (ctx: any) => {
  const reqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.COURSES}`,
    params: { limit: 6, fields: 'id,title,slug,description,banner' }
  }
  const coursesQuery = await makeRequestOne(reqOptions)

  return {
    props: {
      courses: coursesQuery.data.results
    },
    revalidate: 10,
  }
}


IndexPage.PageLayout = HeaderAndFooterWrapper;

export default IndexPage;