import { makeRequestOne, toDate } from "@/config/config"
import { API_ENDPOINTS, REQUEST_STATUS } from "@/config/constants"
import { useAppContext } from "@/providers/appProvider"
import { Button, Group, Loader, Text } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { DataTable } from "mantine-datatable"
import { useRouter } from "next/router"
import { useState } from "react"

export const Requests = (props: any) => {
  const { requests } = props
  const { token } = useAppContext()

  const [loading, setLoading] = useState(false)
  const { reload } = useRouter()

  const handleAccept = (item: any) => {
    let URL = `${API_ENDPOINTS.ACCEPT_REQUEST}/${item.id}`
    setLoading(true)
    makeRequestOne({
      url: URL,
      method: 'POST',
      data: {},
      extra_headers: {
        authorization: `Bearer ${token}`
      },
      useNext: false
    }).then(() => {
      showNotification({
        title: "Success",
        message: "You have successfully become an instructor at the given institution",
        color: "green"
      })
      reload()
    }).catch(() => {
      console.log("Error")
      if (item?.target === 'instructor') {
        showNotification({
          title: "Action Failed",
          message: "We could not complete your request to be an instructor. You don't have an instructor account",
          color: "red"
        })
      }
      else {
        showNotification({
          title: "Action Failed",
          message: "We could not complete your request to be an admin.",
          color: "red"
        })
      }
    }).finally(() => {
      setLoading(false)
    })

  }

  const handleReject = (request: any) => {
    setLoading(true)
    makeRequestOne({
      url: API_ENDPOINTS.REQUESTS + `/${request.id}`,
      method: 'PUT',
      data: {
        read: true,
        status: 'rejected'
      },
      extra_headers: {
        authorization: `Bearer ${token}`
      },
      useNext: false
    }).then((res) => {
      showNotification({
        title: "Success",
        message: "You have successfully rejected the invite",
        color: "green"
      })
      reload()
    }).catch(() => {
      showNotification({
        title: "Failed",
        message: "Something went wrong while rejecting the invite",
        color: "red"
      })
    }).finally(() => {
      setLoading(false)
    })

  }

  const REQUEST_STATUS: any = {
    'rejected': 'red',
    'accepted': 'green',
    'pending': 'yellow'
  }

  return (
    <DataTable
      withTableBorder={true}
      records={requests}
      minHeight={150}
      borderRadius={'lg'}
      verticalSpacing={'sm'}
      horizontalSpacing={'sm'}
      columns={[
        {
          accessor: "id",
          title: '#',
          textAlign: 'left',
          width: '80px',
          render: (item: any, i: number) => (
            <>
              {i + 1}
            </>
          )
        },
        {
          accessor: 'institution.name',
          title: "Institution",
          width: '200px',
        },
        {
          accessor: 'status',
          title: "Status",
          width: '200px',
          render: (item: any, i: number) => (
            <Button size='xs' radius={'xl'} w={'120px'} color={REQUEST_STATUS[item.status]} variant='light' style={{ pointerEvents: "none", textTransform: "uppercase" }}>
              {item?.status}
            </Button>
          )
        },
        {
          accessor: 'target',
          title: "Role",
          width: '100px',
          render: (item: any) => (
            <Text fw={500} style={{ textTransform: "capitalize" }}>
              {item?.target}
            </Text>
          )
        },
        {
          accessor: "created_on",
          title: "Date",
          width: '150px',
          render: (item: any, i: number) => (
            <Text fw={500}>{toDate(item?.created_on)}</Text>
          )
        },
        {
          accessor: "actions",
          title: "Actions",
          width: '200px',
          render: (item: any) => (
            <Group>
              <Button onClick={() => handleAccept(item)} loading={loading} radius={'md'} disabled={item?.read} color='green' variant='outline' size='xs'>
                Accept
              </Button>
              <Button onClick={() => handleReject(item)} loading={loading} radius={'md'} disabled={item?.read} color='red' variant='outline' size='xs'>
                Reject
              </Button>
            </Group>
          )
        }
      ]}
    />
  )
}
