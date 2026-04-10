import PageTitle from '@/components/PageTitle'
import { getAllUsers } from '@/features/user/UserAction'
import UserPage from '@/features/user/components/UserPage'

const Page = async () => {
  const users = await getAllUsers();

  return (
    <>
      <PageTitle>User</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <UserPage users={users.data ?? []}/>
      </div>
    </>
  )
}

export default Page