import { Box } from '@mantine/core'
import React, { ReactNode } from 'react'

interface IAuthPageBox {
    children: ReactNode
}

const AuthPageBox = ({ children }: IAuthPageBox) => {
    return (
        <Box h={'1000px'} style={{
            // background: `url(/assets/images/auth-bg.jpg) 100% 100%, linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundBlendMode: 'multiply',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
        }}>
            {children}
        </Box>
    )
}

export default AuthPageBox