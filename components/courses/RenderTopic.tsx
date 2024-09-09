import { Stack, Title, Grid, Text, Container, Box } from '@mantine/core'
import React from 'react'
import CustomRTE from '../forms/customRTE/CustomRTE'


interface IRenderTopic {
    topic: any,
    order?: any
}

const RenderTopic = (props: IRenderTopic) => {
    const { topic } = props
    return (
        <Box style={{width: '100%'}}>
            <Stack gap={10}>
                <Title order={1 } fw={500} ta='start'>{topic?.title}</Title>
                {/* <Text ta='justify'>{topic?.description}</Text> */}
                <Box mb={100}>
                    <CustomRTE content={topic?.notes} readonly={true} height='auto' />
                </Box>
            </Stack >
        </Box>
    )
}

export default RenderTopic