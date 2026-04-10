import PageTitle from '@/components/PageTitle';
import NotificationPage from '@/features/notification/components/NotificationPage';
import { getNotificaionsByUser } from '@/features/notification/NotificationAction';

export default async function Notification({ params }: { params: { id: string } }) {
  const { id } = await params;
  const notifications = await getNotificaionsByUser(id);

  return (
    <>
      <PageTitle>Notification</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <NotificationPage notifications={notifications.data ?? []}/>
      </div>
    </>
  )
}
