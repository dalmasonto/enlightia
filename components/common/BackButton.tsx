import { Button } from '@mantine/core'
import { IconArrowBack } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import React from 'react'

const BackButton = () => {
    const { back } = useRouter()
    return (
        <div>
            <Button radius="md" leftSection={<IconArrowBack />} size='sm' w={'200px'} style={(theme) => (
                {
                    outline: `2px solid ${theme.colors[theme.primaryColor][6]}`,
                    outlineOffset: "2px"
                }
            )} onClick={back}>
                Go Back
            </Button>
        </div>
    )
}

export default BackButton