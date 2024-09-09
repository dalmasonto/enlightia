import { ActionIcon, Card, useMantineTheme } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconPlayerPlay } from '@tabler/icons-react'
import React from 'react'
import ReactPlayer from 'react-player'

const HomePlayerIcon = () => {

    const theme = useMantineTheme()

    const showPlayerModal = () => modals.open({
        title: "How to get started",
        size: 1000,
        radius: 'lg',
        centered: true,
        children: (
            <>
                <Card p={0} radius={'lg'}>
                    <ReactPlayer height={'500px'} url="https://youtu.be/h8a4GcCufbc" width={'100%'} playing={true} />
                </Card>
            </>
        )
    })
    return (
        <ActionIcon onClick={showPlayerModal} size={'92px'} radius={'50%'} bg={theme.colors[theme.primaryColor][9]}>
            <IconPlayerPlay size={'52px'} />
        </ActionIcon>
    )
}

export default HomePlayerIcon