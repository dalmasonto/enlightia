import { Paper, Text, useMantineTheme, Group, Stack, Box, Image, Rating } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import { PRIMARY_DEEP_COLOR } from "@/config/constants";

function addZero(rating: any) {
    if (rating?.toString().length == 1) {
        return rating?.toString() + ".0"
    }
    return rating
}

function FarmerTestimonialCard({ review, rating, user }: any) {
    const avatarSize = 120
    return (
        <Box style={{ zIndex: 1 }} >
            <Box p={'md'} ml="lg" bg={'white'} mb={`-${avatarSize / 1.5}px`} style={{
                borderRadius: "50%",
                width: `${avatarSize}px`,
                height: `${avatarSize}px`,
                overflow: "hidden",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
                position: 'relative',
            }}>
                <Image src={user?.profile?.avatar ?? "/assets/images/icons/logo-whitepng.png"} w={`${avatarSize}px`} h={`${avatarSize}px`} />
            </Box>
            <Paper
                shadow="md"
                p="md"
                px={{ base: 'sm', md: '50px' }}
                radius="lg"
                style={{
                    background: PRIMARY_DEEP_COLOR,
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <Group gap={10}>
                    <Box w={`${avatarSize}px`} h={`${avatarSize}px`} />
                    <Stack gap={6} flex={1}>
                        <Text c={"white"} fw={400} size="md" lh={'22px'}>{user?.full_name}</Text>
                        <Group justify="space-between" align="center" wrap="nowrap">
                            <Text c={"white"} fw={500} size="lg" lh={'22px'}>Farmer</Text>
                            <Group gap={2} align="center">
                                <Text c={"white"} size="sm">{addZero(rating) ?? '5.0'}</Text>
                                <Rating fractions={2} value={rating ?? 5} color="orange" />
                            </Group>
                        </Group>
                    </Stack>
                </Group>
                <Text c={'white'}>
                    {review ?? ''}
                </Text>
            </Paper>
        </Box>
    );
}


interface IFarmerTestimonialsLandingPage {
    testimonials: any[]
}


function FarmerTestimonialsLandingPage(props: IFarmerTestimonialsLandingPage) {
    const { testimonials } = props
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const slides = testimonials?.map((item: any, i: number) => (
        <Carousel.Slide key={`review_${i}`}>
            <FarmerTestimonialCard {...item} />
        </Carousel.Slide>
    ));

    return (
        <Carousel
            slideSize={{ base: '100%', sm: '50%' }}
            slideGap={{ base: 'xl', sm: 2, md: 50 }}
            align="start"
            slidesToScroll={mobile ? 1 : 2}
            withControls
            withIndicators
            pb={'80px'}
        >
            {slides}
        </Carousel>
    );
}

export { FarmerTestimonialCard }

export default FarmerTestimonialsLandingPage