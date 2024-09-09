import { Box, Center, Image, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core'
import React from 'react'
import { useForm } from '@mantine/form'
import { isDarkMode } from '@/config/config'

interface FileBoxProps {
    item: any,
    padding?: string,
    radius?: string,
    openDrawer: any
}

export function renderItem(item: any) {
    return (
        <>
            {
                item?.type === 'image' ? (
                    <Image loading='lazy' radius={"sm"} fit='scale-down' src={item?.file} />
                ) : null
            }
            {
                item?.type === 'document' ? (
                    <Text fw={500} tt='uppercase'>Doc</Text>
                ) : null
            }
            {
                item?.type === 'video' ? (
                    <Text fw={500} tt='uppercase'>Vid</Text>
                ) : null
            }
            {
                item?.type === 'audio' ? (
                    <Text fw={500} tt='uppercase'>Audio</Text>
                ) : null
            }
            {
                item?.type === 'unknown' ? (
                    <Text fw={500} tt='uppercase'>Other</Text>
                ) : null
            }
        </>
    )
}

const FileBox = (props: FileBoxProps) => {
    const { item, padding, radius, openDrawer } = props
    const { colorScheme } = useMantineColorScheme()

    const theme = useMantineTheme()

    return (
        <>
            <Box p={padding ? padding : "xs"} h={'100px'} style={{
                background: isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[1],
                overflow: "hidden",
                borderRadius: theme.radius[radius ? radius : "md"],
                cursor: "pointer",
            }} onClick={() => openDrawer(item)} >
                <Center className=" w-100" h='100%'>
                    {renderItem(item)}
                </Center>
            </Box>
        </>
    )
}

export default FileBox