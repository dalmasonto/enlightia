import CreateInstitutionForm from '@/components/forms/more_forms/CreateInstitutionForm'
import { LOCAL_STORAGE_KEYS } from '@/config/constants'
import AccountWrapper from '@/layouts/AccountWrapper'
import React from 'react'

const CreateInstitution = () => {
    return (
        <div>
            <CreateInstitutionForm updating={false} />
        </div>
    )
}

export async function getServerSideProps(context: any) {
    const cookies = context.req.cookies
    const userDetails_: any = cookies[LOCAL_STORAGE_KEYS.user]

    const token = cookies[LOCAL_STORAGE_KEYS.token]

    const userDetails: any = JSON.parse(userDetails_ ?? "{}")

    return {
        props: {

        }
    }
}

CreateInstitution.PageLayout = AccountWrapper
export default CreateInstitution