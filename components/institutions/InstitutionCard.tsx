import { isDarkMode } from "@/config/config"
import { APP_NAME } from "@/config/constants"
import { Card, Stack, Box, Anchor, Image, Text, Center, useMantineColorScheme, useMantineTheme } from "@mantine/core"
import Link from "next/link"


const InstitutionCard = (props: any) => {
    const { institution } = props
    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()

    return (
        <Card shadow='lg' radius={'lg'}>
            <Card.Section>
                <Image
                    loading="lazy"
                    src={institution?.banner ?? "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"}
                    height={160}
                    alt={institution?.name}
                />
            </Card.Section>
            <Stack align='center'>
                <Box style={{ height: "80px" }} mt={'-40px'}>
                    <Box w={'80px'} h={'80px'} style={{
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[2]
                    }}>
                        <Center w={'100%'} h={'100%'}>
                            <Image loading="lazy" w={'80%'} src={institution?.logo} maw={'100%'} mah={'100%'} alt={APP_NAME} />
                        </Center>
                    </Box>
                </Box>
                <Anchor component={Link} passHref href={`/institution/admin/${institution?.id}/${institution?.slug}`}>
                    <Text ta='center' fw={500} size="md">
                        {institution?.name}
                    </Text>
                </Anchor>
            </Stack>
        </Card>
    )
}

export default InstitutionCard