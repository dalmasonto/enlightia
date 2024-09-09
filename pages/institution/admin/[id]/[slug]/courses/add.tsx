import React from 'react'
import { Container, Stack, Title } from '@mantine/core';
import AddCourseForm from '../../../../../../components/courses/AddCourseForm';
import { useAppContext } from '../../../../../../providers/appProvider';
import InstitutionWrapper from '@/layouts/InstitutionWrapper';



const AddCourse = (props: any) => {

  const { user } = useAppContext();

  return (
    <div>

      <Container size="xl">
        <Stack>
          <Title mb="md" fw={500}>Add New Course</Title>
          <AddCourseForm updating={false} />
        </Stack>
      </Container>
    </div>
  )
}

AddCourse.PageLayout = InstitutionWrapper

export default AddCourse