import { Alert } from '@mantine/core'
import React, { ReactNode } from 'react'

interface INoDataFound {
    visible: boolean
    description: string
    title?: string
    color?: string
    icon?: ReactNode
}
const NoDataFound = ({ visible, description, title, color, icon }: INoDataFound) => {
    return (
        <>
            {
                visible ? (
                    <Alert icon={icon} title={title} color={color} radius={'md'} variant='light'>
                        {description}
                    </Alert>
                ) : null
            }
        </>
    )
}

export default NoDataFound