import CreateBlogForm from '@/components/forms/CreateBlogForm'
import { LOCAL_STORAGE_KEYS } from '@/config/constants'
import AdminWrapper from '@/layouts/AdminWrapper'
import { Container } from '@mantine/core'
import React from 'react'

const CreateBlog = () => {

  return (
    <div>
      <Container>
        <CreateBlogForm />
      </Container>
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

CreateBlog.PageLayout = AdminWrapper

export default CreateBlog