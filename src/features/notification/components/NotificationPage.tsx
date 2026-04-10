"use client";
import DefaultTable from "@/components/Table/DefaulteTable";
import { NotificationTable } from "@/modules/notification/notification.schema";
import { NotificationColumns } from "../columns/NotificationsColumns";
import { SortingState } from "@tanstack/react-table";

const defaultSort: SortingState = [{id: "no", desc: false}]

const NotificationPage = ({
  notifications
}: {
  notifications: NotificationTable[]
}) => {
  return (
    <DefaultTable<NotificationTable>
      data={notifications ?? []}
      columns={NotificationColumns()}
      defaultSort={defaultSort}
    />
  )
}

export default NotificationPage