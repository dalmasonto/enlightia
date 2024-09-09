import { ActionIcon, Anchor, Box, Container, Divider, Grid, Group, Stack, Text, Title, Tooltip, darken, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import HeaderAndFooterWrapper from '@/layouts/HeaderAndFooterWrapper';
import Head from 'next/head';
import { APP_NAME } from '@/config/constants';
import ContactCreateForm from '@/components/forms/more_forms/ContactCreateForm';
import { isDarkMode } from '@/config/config';
import { IconBrandFacebook, IconBrandTwitter, IconBrandWhatsapp, IconBrandYoutube, IconMail, IconPhone, IconPhoneCall, IconPin } from '@tabler/icons-react';
import WrapperBox from '@/components/common/WrapperBox';
import { ReactNode } from 'react';

interface ISocialIcon {
  title: string
  url: string
  color: string
  icon: ReactNode
}

const SocialIcon = (props: ISocialIcon) => {
  const { title, url, color, icon } = props
  return (
    <Tooltip label={title} color={color}>
      <Anchor href={url} target='_blank'>
        <ActionIcon color={color} size={'42px'} radius={'xl'} variant='filled'>
          {icon}
        </ActionIcon>
      </Anchor>
    </Tooltip>
  )
}

const socialLinks: ISocialIcon[] = [
  {
    title: "Facebook",
    url: "https://www.facebook.com/livesoftwaredeveloper/",
    color: "blue",
    icon: <IconBrandFacebook />
  },
  {
    title: "Twitter",
    url: "https://twitter.com/LiveSoftwareDev",
    color: "indigo",
    icon: <IconBrandTwitter />
  },
  {
    title: "YouTube",
    url: "https://www.youtube.com/@magiccalabashcodes",
    color: "red",
    icon: <IconBrandYoutube />
  },
  {
    title: "Whatsapp",
    url: "https://wa.me/+254742407266",
    color: "green",
    icon: <IconBrandWhatsapp />
  },
]

function ContactUs() {
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()

  return (
    <>
      <Head>
        <title>{`${APP_NAME} - Contact Us`}</title>
      </Head>
      <Stack>
        <Box py={'70px'} bg={isDarkMode(colorScheme) ? darken(theme.colors[theme.primaryColor][9], 0.5) : theme.colors[theme.primaryColor][8]}>
          <Title size={'52px'} ta={'center'} c="white">Get In Touch</Title>
          <Text size="lg" fw={500} c="white" ta={'center'}>Quickly talk to us</Text>
        </Box>
        <Container size={"lg"} py={"70px"}>
          <Grid>
            <Grid.Col span={{ md: 6 }}>
              <Box p={{ md: '40px' }} bg={isDarkMode(colorScheme) ? theme.colors.dark[6] : theme.colors.gray[1]} style={{
                borderRadius: theme.radius.lg
              }}>
                <Stack p="lg">
                  <Title order={2} size={'32px'}>Send Message</Title>
                  <Text>Write us a message and we will respond to you quickly</Text>
                  <ContactCreateForm />
                </Stack>
              </Box>
            </Grid.Col>
            <Grid.Col span={{ md: 6 }} p={{ md: '40px' }}>
              <Stack px="lg">
                <Divider
                  my="xs"
                  variant="solid"
                  size={4}
                  color='green'
                  fw={600}
                  labelPosition="center"
                  label={
                    <>
                      <IconPhoneCall size={22} />
                      <Text ml={5} fw={600} size='22px'>OR</Text>
                    </>
                  }
                />
                <WrapperBox color='green'>
                  <Group wrap='nowrap'>
                    <ActionIcon color='green' radius={'md'} size={'42px'}>
                      <IconPhone />
                    </ActionIcon>
                    <Stack gap={2}>
                      <Text fw={600} size='lg'>Call Us</Text>
                      <Anchor href="tel:+25406522473">
                        <Text fw={500} size='md' c={isDarkMode(colorScheme) ? 'white' : 'dark'}>+254 706 522 473</Text>
                      </Anchor>
                      <Anchor href="tel:+254742407266">
                        <Text fw={500} size='md' c={isDarkMode(colorScheme) ? 'white' : 'dark'} >+254 742 407 286</Text>
                      </Anchor>
                    </Stack>
                  </Group>
                </WrapperBox>
                <WrapperBox color='yellow'>
                  <Group wrap='nowrap'>
                    <ActionIcon color='yellow' radius={'md'} size={'42px'}>
                      <IconMail />
                    </ActionIcon>
                    <Stack gap={2}>
                      <Text fw={600} size='lg'>Email uS</Text>
                      <Anchor href="mailto:support@livesoftwaredeveloper.com">
                        <Text fw={500} size='md' c={isDarkMode(colorScheme) ? 'white' : 'dark'}>
                          support@livesoftwaredeveloper.com
                        </Text>
                      </Anchor>
                    </Stack>
                  </Group>
                </WrapperBox>
                <WrapperBox color='indigo'>
                  <Group wrap='nowrap'>
                    <ActionIcon color='indigo' radius={'md'} size={'42px'}>
                      <IconPin />
                    </ActionIcon>
                    <Stack gap={2}>
                      <Text fw={600} size='lg'>Visit Us</Text>
                      <Text fw={500} size='md'>Adams Arcade, 1<sup>ST</sup> Floor, Ngong Road, Nairobi, Kenya</Text>
                    </Stack>
                  </Group>
                </WrapperBox>
                <WrapperBox color='violet'>
                  <Stack gap={10}>
                    <Title order={3}>Our Socials</Title>
                    <Group gap={20} justify='space-evenly'>
                      {
                        socialLinks?.map((item: ISocialIcon, i: number) => (
                          <SocialIcon key={`social_${i}_${item.title}`} {...item} />
                        ))
                      }
                    </Group>
                  </Stack>
                </WrapperBox>
              </Stack>
            </Grid.Col>
            {/* <Grid.Col>
              <Box h="600px">
                <iframe width={'100%'} height={'100%'} style={{ border: `2px solid ${theme.colors.green[7]}`, outline: "none", borderRadius: "20px" }} src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.793930318121!2d36.79038707490384!3d-1.29838363563932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6fda5acbcdcb861f%3A0x744423a9e1263850!2sRhea%20Africa!5e0!3m2!1sen!2sus!4v1688370866586!5m2!1sen!2sus' />
              </Box>
            </Grid.Col> */}
          </Grid>
        </Container>
      </Stack>
    </>
  );
}


ContactUs.PageLayout = HeaderAndFooterWrapper

export default ContactUs

