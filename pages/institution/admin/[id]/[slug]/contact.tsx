import SingleTopicForm from '@/components/courses/SingleTopicForm'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'
import { Stack, Box, Title, Text, Button } from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'

const topicInfo = {
  id: null,
  period: 0,
  title: "",
  description: "",
  order: 0,
  notes: "",
  subtopics: []
}

const Admin = () => {
  
  const form = useForm({
    initialValues: {
      notes: "",
      topics: []
    }
  })


  const handleSubmission = () => {

  }

  const addTopic = () => {
    form.insertListItem('topics', topicInfo)
  }

  console.log(form.values)

  return (
    <div>
      <Stack>
        <Box>
          <Title>Contact Form Entries</Title>
          <Text size="sm">Filled contact form for this institution.</Text>
        </Box>
        <Box>
          <Button variant='light' radius={'md'} onClick={addTopic}>Add Topic</Button>
        </Box>
        <form onSubmit={form.onSubmit((_) => handleSubmission())}>
          <Stack>
            {
              form.values.topics.map((topic: any, i: number) => <SingleTopicForm key={`topic_${i}`} form={form} path={`topics.${i}`} topic={topic} />)
            }
          </Stack>
        </form>
      </Stack>
    </div>
  )
}

Admin.PageLayout = InstitutionWrapper

export default Admin