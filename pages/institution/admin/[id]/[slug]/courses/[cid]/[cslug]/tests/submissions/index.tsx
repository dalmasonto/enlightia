
import Link from 'next/link'
import { IconSend2 } from '@tabler/icons-react'
import React from 'react'
import SEOHeader from '@/components/seo/SEOHeader'
import CustomDataTable from '@/components/tables/filters/CustomDataTable'
import { toDate } from '@/config/config'
import { TABLE_ICON_SIZE, API_ENDPOINTS } from '@/config/constants'
import InstitutionWrapper from '@/layouts/InstitutionWrapper'
import { ActionIcon, Stack, Text, Title } from '@mantine/core'
import { useRouter } from 'next/router'

interface IViewTestSubmissionLinkBtn {
  item: any
}

const ViewTestSubmissionLinkBtn = (props: IViewTestSubmissionLinkBtn) => {
  const { item } = props
  const {query} = useRouter()

  return (
    <Link href={`/institution/admin/${query.id}/${query.slug}/courses/${query.cid}/${query.cslug}/tests/submissions/${item?.id}`}>
      <ActionIcon variant='light'
        size="md"
        radius="md"
      >
        <IconSend2 size={TABLE_ICON_SIZE} />
      </ActionIcon>
    </Link>
  )
}

const TestSubmissions = () => {
  const { query } = useRouter()

  return (
    <div>
      <SEOHeader
        url={''}
        title={'Add New Test'}
        description={''}
        keywords={''}
        image={''}
        twitter_card={''} />
      <Stack>
        <Title fw={500} order={2}>Test Submissions</Title>
        <Stack>
          <CustomDataTable
            url={API_ENDPOINTS.COMPLETED_TESTS}
            method={'GET'}
            defaultFilters={{
              page: 1,
              limit: '10',
              ordering: 'id',
              search: "",
              test__course__id: query.cid,
              // fields: "id,name,description,created_at,modified_at"
              fields: "id,test,course,title,cohort,student,user,full_name,created_on,points"
            }}
            useNext={false}
            hideUpdateActionBtn={true}
            formValidators={undefined}
            extraActionButtons={[
              {
                title: 'View Submission',
                color: 'green',
                element: ViewTestSubmissionLinkBtn
              }
            ]}
            updateData={{
              formNode: undefined,
              modalSize: 'lg',
              updatingModalTitle: "Update Category",
              deletingModalTitle: "Delete Category"
            }}
            columns={[
              {
                accessor: 'id',
                title: '#',
                textAlign: 'left',
                width: '80px',
              },
              {
                accessor: 'student.user.full_name',
                title: "Student",
                width: '200px'
              },
              {
                accessor: 'points',
                title: "Points",
                width: '100px',
                render: (item: any) => (
                  <Text>{item?.points ?? '-'}</Text>
                )
              },
              {
                accessor: 'test.title',
                title: "Test",
                width: '200px'
              },
              {
                accessor: 'test.cohort.title',
                title: "Cohort",
                width: '200px'
              },
              {
                accessor: "created_on",
                title: "Submited On",
                width: "150px",
                render: (item: any, i: number) => (
                  <Text>{toDate(item?.created_on)}</Text>
                )
              },
            ]}
            filterFields={[
              {
                accessor: 'limit',
                label: 'Limit',
                gridSize: 2,
                placeholder: '23',
                type: 'select',
                options: [
                  { value: '2', label: '2' },
                  { value: '5', label: '5' },
                  { value: '10', label: '10' },
                  { value: '15', label: '15' },
                  { value: '20', label: '20' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' },
                ]
              },
              {
                accessor: 'search',
                label: 'Search',
                gridSize: 2,
                placeholder: 'Search by title',
                type: 'text'
              },
              {
                accessor: 'ordering',
                label: 'Ordering',
                gridSize: 2,
                placeholder: '23',
                type: 'select',
                options: [
                  {
                    group: 'Ascending',
                    items: [
                      { value: 'id', label: 'ID' },
                      { value: 'title', label: 'Title' },
                    ]
                  },
                  {
                    group: 'Descending',
                    items: [
                      { value: '-id', label: 'ID' },
                      { value: '-title', label: 'Title' },
                    ]
                  }
                ]
              },
            ]}
          />
        </Stack>

      </Stack>
    </div>
  )
}

TestSubmissions.PageLayout = InstitutionWrapper
export default TestSubmissions