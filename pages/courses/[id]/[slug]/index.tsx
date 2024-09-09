import React, { ElementType, useEffect, useState } from 'react'
import { Avatar, BackgroundImage, Box, Button, Card, Container, em, Group, Loader, LoadingOverlay, NavLink, Paper, SegmentedControl, Stack, Tabs, Text, Title, Tooltip, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import { RequestProps, isDarkMode, limitChars, makeRequest, makeRequestOne } from '../../../../config/config'
import Link from 'next/link'
import { useAppContext } from '../../../../providers/appProvider'
import { checkIfEnrolledServerSide, displayErrors } from '../../../../config/functions'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { API_ENDPOINTS, containerSize } from '@/config/constants'
import { IconLetterT, IconExclamationMark, IconWriting, IconInfoCircle, IconListDetails, IconSignature, IconCheck } from '@tabler/icons-react'
import NoDataFound from '@/components/errors/NoDataFound'
import CourseWrapper from '@/layouts/CourseWrapper'
import TestCard from '@/components/courses/tests/TestCard'
import CustomRTE from '@/components/forms/customRTE/CustomRTE'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

export const Topic = (props: any) => {
  const { topic, index } = props
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  return (
    <Group wrap='nowrap' gap={10} align='start'>
      <Avatar radius={'md'}>
        {index + 1}
      </Avatar>
      <Box flex={1}>
        {
          topic?.subtopics && topic?.subtopics?.length === 0 ? (
            <NavLink bg={isDarkMode(colorScheme) ? theme.colors.dark[7] : theme.colors.gray[0]} style={{
              borderRadius: theme.radius.md
            }} fw={500} leftSection={<IconLetterT size="1.2rem" color={theme.colors[theme.primaryColor][6]} />} label={`${topic?.title} - ${topic?.period} Hr${topic?.period > 1 ? 's' : ''}`} description={limitChars(topic?.description, 255)} />
          ) : (
            <NavLink bg={isDarkMode(colorScheme) ? theme.colors.dark[7] : theme.colors.gray[0]} fw={500} style={{
              borderRadius: theme.radius.md
            }} leftSection={<IconLetterT size="1.2rem" color={theme.colors[theme.primaryColor][6]} />} label={`${topic?.title} - ${topic?.period} Hr${topic?.period > 1 ? 's' : ''}`} description={limitChars(topic?.description, 255)}>
              <Stack pt={'xs'} gap={5}>
                {
                  topic?.subtopics?.map((subtopic: any, i: any) => (
                    <Topic key={`${topic?.id}_${subtopic?.id}`} topic={subtopic} index={i} />
                  ))
                }
              </Stack>
            </NavLink>
          )
        }
      </Box>
    </Group>
  )
}

interface IEnrollToCourse {
  cohort: any
  existingEnrollments: any
}


export const EnrollToCourse = ({ cohort, existingEnrollments }: IEnrollToCourse) => {
  const { user, token, login_status } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [user_, setUser] = useState<null | any>(null)

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme()
  const router = useRouter()

  const form = useForm({
    initialValues: {
      student: null,
      course: null,
      cohort: null
    }
  })

  const handleEnroll = () => {
    setLoading(true)
    form.clearErrors()
    makeRequestOne({
      method: 'POST',
      url: `${API_ENDPOINTS.ENROLLMENTS}`,
      useNext: false,
      data: {
        created_by: user.id,
        student: user?.student,
        course: cohort.course,
        cohort: cohort?.id,
      },
      extra_headers: {
        authorization: `Bearer ${token}`
      }
    }).then(() => {
      showNotification({
        title: "Enrollment successful",
        message: "You have successfully enrolled to this course",
        color: "green"
      })
      router.reload()
    }).catch(err => {
      const errors = err?.response?.data
      displayErrors(form, errors)

      showNotification({
        title: "Enrollment failed",
        message: "We are unable to enroll you at this particular time",
        color: "red"
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    const checkIfEnrolled = existingEnrollments?.some((enrollment: any) => enrollment?.cohort?.id === cohort.id && enrollment?.course?.id === cohort.course)
    setEnrolled(checkIfEnrolled)
    setUser(user)
  }, [existingEnrollments, user])

  return (
    <Paper p={20} radius="md" mb={10} style={{
      position: "relative",
      background: isDarkMode(colorScheme) ? theme.colors.dark[7] : theme.colors.gray[0],
    }}
    >
      <LoadingOverlay visible={loading} />
      <Group align='center' justify='space-between'>
        <Title order={4} fw={500}>{cohort?.title}</Title>
        {
          user_?.student ? (
            <Button onClick={handleEnroll} disabled={enrolled} radius={'xl'} rightSection={enrolled ? <IconCheck size={'18px'} stroke={em(1.5)} /> : <IconSignature size={'18px'} stroke={em(1.5)} />}>
              {enrolled ? 'Enrolled' : 'Enroll'}
            </Button>
          ) : (
            <Tooltip defaultChecked={true} color='red' label={login_status ? "You are not a student" : "Log In required"}>
              <Group gap={0} align='center'>
                <Text c='red' size="xs">You cannot enroll</Text>
                <IconExclamationMark size={16} />
              </Group>
            </Tooltip>
          )
        }
      </Group>
      <Box>
        {
          Object.keys(form.errors).map((field: string, i: number) => (
            <Group key={`error_${i}`} align='center'>
              <Text size="sm" color='red'>{form.errors[field]}</Text>
            </Group>
          ))
        }
      </Box>
    </Paper>
  )
}


const OutlineSegmentLabel = ({ Icon, label }: { Icon: ElementType, label: string }) => {
  return (
    <Group gap={10} justify='center'>
      <Icon size="22px" stroke={em(1.5)} />
      <Text>{label}</Text>
    </Group>
  )
}

interface ISingleCourse {
  course: any
  topics: any
  cohorts: any
  tests: any
}

const SingleCourse = ({ course, topics, cohorts, tests }: ISingleCourse) => {

  const { token, user } = useAppContext()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'about')

  const [enrollments, setEnrollments] = useState([])

  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  useEffect(() => {
    checkIfEnrolledServerSide(token, user?.student, course?.id).then((res) => {
      setEnrollments(res)
    }).catch(() => { })
  }, [token, user?.student, course?.id])


  useEffect(() => {
    setActiveTab(searchParams.get('tab') ?? 'about')
  }, [searchParams.get('tab')])

  if (!course) {
    return (
      <Group justify='center' py={50}>
        <Loader size={200} type='dots' stroke={em(1.5)} />
      </Group>
    )
  }

  return (
    <div>
      <BackgroundImage src={course?.banner} radius={'md'}>
        <Box py={20} style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3) 100%)",
          borderRadius: theme.radius.md,
          overflow: "hidden"
        }}>
          <Container size={containerSize} py={60}>
            <Title ta={'center'}>
              {course?.title}
            </Title>
          </Container>
        </Box>
      </BackgroundImage>
      <Container size="lg" pt={50} pb={150}>
        <Card radius={'lg'} bg={isDarkMode(colorScheme) ? theme.colors.dark[9] : theme.white}>
          <Stack>
            <Title order={2} fw={500} lh={"50px"} ta={'center'}>Course Information</Title>
            <Text fw={500} size='sm' ta={'center'}>
              {course?.description}
            </Text>
            <SegmentedControl
              color={theme.primaryColor}
              radius={'xl'}
              value={activeTab}
              onChange={setActiveTab}
              data={[
                {
                  value: 'about',
                  label: <OutlineSegmentLabel Icon={IconInfoCircle} label='About' />
                },
                {
                  value: 'topics',
                  label: <OutlineSegmentLabel Icon={IconLetterT} label='Topics' />
                },
                {
                  value: 'tests',
                  label: <OutlineSegmentLabel Icon={IconListDetails} label='Tests' />
                },
                {
                  value: 'lessons',
                  label: <OutlineSegmentLabel Icon={IconListDetails} label='Lessons' />
                },
                {
                  value: 'exams',
                  label: <OutlineSegmentLabel Icon={IconWriting} label='Exams' />
                },
                {
                  value: 'enrollment',
                  label: <OutlineSegmentLabel Icon={IconSignature} label='Enrollment' />
                },
              ]}

            />
            <Tabs defaultValue="about" value={activeTab}>
              <Tabs.Panel value="about" pt="xs">
                <Title order={3} fw={400}>About</Title>
                <CustomRTE content={course?.notes} readonly={true} />
              </Tabs.Panel>

              <Tabs.Panel value="topics" pt="xs">
                <Stack gap={10}>
                  <Title order={3} fw={400}>Topics</Title>
                  <Stack gap={10}>
                    {
                      topics?.map((topic: any, i: any) => (
                        <Topic key={`topic_${topic?.id}`} topic={topic} index={i} />
                      ))
                    }
                  </Stack>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="lessons" pt="xs">
                <Title order={3} fw={400}>Lessons</Title>
              </Tabs.Panel>

              <Tabs.Panel value="tests" pt="xs">
                <Stack gap={10}>
                  <Title order={3} fw={400}>Tests</Title>
                  <NoDataFound visible={tests?.length === 0} description='No active tests found for this course' />

                  {
                    tests?.map((test: any) => (
                      <TestCard key={`_test_${test.id}`} test={test} testURL={''} hideStartTestButton={true} />
                    ))
                  }
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="exams" pt="xs">
                <Title order={3} fw={400}>Exams</Title>
              </Tabs.Panel>
              <Tabs.Panel value="enrollment" pt="xs">
                <Title order={3} fw={400} mb="xl">Enrollment</Title>
                <NoDataFound visible={cohorts?.length === 0} description='No active cohorts found for this course' />
                {
                  cohorts?.map((cohort: any) => (
                    <EnrollToCourse key={`cohort_${cohort.id}`} cohort={cohort} existingEnrollments={enrollments} />
                  ))
                }
              </Tabs.Panel>
              <Tabs.Panel value='start' pt="xs">
                <Button component={Link} href={`/courses/${course?.id}/${course?.slug}/about`}>Start Course</Button>
              </Tabs.Panel>
            </Tabs>
          </Stack>
        </Card>
      </Container>
    </div>
  )
}


export async function getStaticPaths() {
  const courses: any = await makeRequest(`${API_ENDPOINTS.COURSES}`, "GET", {}, {}, { limit: 1 })
  let paths = []
  if (courses?.success) {
    paths = courses?.success?.results?.map((course: any) => {
      return {
        params: { id: course?.id.toString(), slug: course?.slug.toString() },
      }
    })
  }

  return {
    paths: paths,
    fallback: true, // can also be true, false or 'blocking',
  }
}

export const getStaticProps = async (context: any) => {
  const { params } = context

  const courseReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.COURSES}/${params?.id}`,
    params: { fields: 'id,title,slug,banner,description,notes' }
  }

  const courseTopicReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.TOPICS}`,
    params: { course__id: params?.id, parent__isnull: true, fields: 'title,subtopics,description,order,period' }
  }

  const courseCohortsReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.COHORTS}`,
    params: { course: params?.id, allows_enrollment: true, fields: "id,title,allows_enrollment,course" }
  }

  const courseTestsForActiveCohortReqOptions: RequestProps = {
    method: "GET",
    url: `${API_ENDPOINTS.TESTS}`,
    params: { course: params?.id, cohort__active: true, fields: "id,title,topics,description,question_count" }
  }

  const course = await makeRequestOne(courseReqOptions)
  const courseTopics = await makeRequestOne(courseTopicReqOptions)
  const cohorts = await makeRequestOne(courseCohortsReqOptions)
  const tests = await makeRequestOne(courseTestsForActiveCohortReqOptions)

  return {
    props: {
      course: course.data,
      topics: courseTopics?.data?.results,
      cohorts: cohorts?.data?.results,
      tests: tests.data?.results
    },
    revalidate: 20,
  }
}


// SingleCourse.PageLayout = HeaderAndFooterWrapper
SingleCourse.PageLayout = CourseWrapper

export default SingleCourse