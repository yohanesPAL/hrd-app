"use client";
import Image from 'next/image'
import { Button, Dropdown, DropdownDivider, DropdownMenu, DropdownToggle, Navbar, Spinner, Stack } from 'react-bootstrap'
import useNavbar from '@/stores/navbar/navbar.store'
import Link from 'next/link';
import { useLogout } from '@/hooks/useLogout';
import { NotificationPopup } from '@/modules/notification/notification.schema';
import { useEffect, useState } from 'react';
import { createContractNearExpirationNotification, getNotificationsPopupAction, markedNotificationsReadActionAction } from '@/features/notification/NotificationAction';
import styles from './topbar.module.css'
import { useActionHandler } from '@/hooks/useActionHandler';

const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

const calculateDaysDelta = (date: Date) => {
  const today = new Date();

  const utc1 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const utc2 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  return (utc1 - utc2) / (1000 * 60 * 60 * 24);
}

const formatDaysDeltaToText = (days: number) => {
  const sufix = days > 0 ? "kemudian" : "lalu"

  if (days === 0) return "Hari ini";
  else return `${Math.abs(days)} hari ${sufix}`
}

const borderColor = new Map([
  [1, "green"],
  [2, "gold"],
  [3, "red"],
]);

const TopBar = ({
  role,
  karyawanId,
  userId,
  namaKaryawan,
}: {
  role: string,
  karyawanId: string,
  userId: string,
  namaKaryawan: string,
}) => {
  const showNavbar = useNavbar((state) => state.setShow);
  const navbarState = useNavbar((state) => state.isShow);
  const { onLogout, loading } = useLogout();
  const { run, isPending } = useActionHandler();
  const [notifications, setNotificitaions] = useState<NotificationPopup[]>([]);
  const [isFetchNotif, setIsFetchNotif] = useState<boolean>(false);

  const logoutHandler = async () => {
    await onLogout()
  }

  const markNotificationRead = async (notificationIds: string[]) => {
    try {
      await run(markedNotificationsReadActionAction, [notificationIds], {
        toast: {
          pending: "Memproses...",
          success: "Sukses",
          error: "Ooops... ada yang salah",
        },
        refresh: true,
      })

      return true;
    } catch (error) {
      return false;
    }
  }

  const readAllNotifications = async () => {
    const lastNotifications = notifications;
    if (!lastNotifications.length || lastNotifications.length === 0) return;

    setNotificitaions([]);

    const notifId: string[] = notifications.map(notif => notif.notif_id);
    const res = await markNotificationRead(notifId);

    if (!res) setNotificitaions(lastNotifications.sort((a, b) => Number(a.notif_id) - Number(b.notif_id)));
  }

  const readOneNotification = async (notificationId: string) => {
    const notification: NotificationPopup | undefined = notifications.find(item => item.notif_id === notificationId);
    if (!notification) return;

    setNotificitaions(prev => prev.filter(item => item.notif_id !== notificationId))

    const idInArray: string[] = [notificationId];
    const res = await markNotificationRead(idInArray);

    if (!res) setNotificitaions(prev => [notification, ...prev].sort((a, b) => Number(a.notif_id) - Number(b.notif_id)));
  }

  const createNotif = async () => {
    await run(createContractNearExpirationNotification, [], {
      toast: {
        pending: "Create notif...",
        success: "Berhasil create notif",
        error: "Ooops... ada yang salah",
      }
    })
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsFetchNotif(true);

      const res = await getNotificationsPopupAction(userId)
      await delay(2000)
      setNotificitaions(res.data ?? []);
      setIsFetchNotif(false);
    }

    fetchNotifications()
  }, [])

  return (
    <>
      <div style={{ background: 'var(--primary)', color: "white", height: "4rem", padding: 0 }}>
        <Navbar className='w-100 h-100 white-shade d-flex align-items-center justify-content-between py-0'>
          <div onClick={() => showNavbar(!navbarState)} className='on-hover d-flex align-items-center justify-content-center' style={{ height: "100%", width: "4rem" }}>
            <i className="bi bi-list fs-3"></i>
          </div>

          <Stack className='h-100' direction='horizontal'>
            <Button type='button' onClick={createNotif}>test</Button>
            <Dropdown className='h-100' align={"end"}>
              <DropdownToggle className='d-flex flex-row align-items-center justify-content-center h-100 px-3 py-0 bg-transparent border-0 on-hover rounded-0'>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <i className="bi bi-bell-fill" style={{ fontSize: "18px" }} />
                  {notifications.length > 0 && (
                    <span style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-8px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      fontSize: "10px",
                      fontWeight: "bold",
                      width: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}>
                      {notifications.length}
                    </span>
                  )}
                </div>
              </DropdownToggle>
              <DropdownMenu style={{ width: "300px", boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.2)" }} className='bg-white p-0'>
                <>
                  <div className='d-flex flex-row align-items-center justify-content-center w-100 py-2 mb-2' style={{ boxShadow: "0 0.5px 4px rgba(0, 0, 0, 0.1)" }}>
                    <Link href={`/${role}/notification/${userId}`} target='_blank'>
                      <Button variant='link'>
                        <Stack direction='horizontal' gap={1}>
                          <b>Notifikasi</b>
                          <i className="bi bi-box-arrow-up-right"></i>
                        </Stack>
                      </Button>
                    </Link>
                  </div>
                  {
                    notifications.length === 0
                      ? isFetchNotif
                        ? (<div className='w-100 text-center py-4'><Spinner style={{ color: "rgba(0,0,0,0.5)" }} /></div>)
                        : (<div className='w-100 text-center py-4'>Notifikasi Kosong</div>)
                      : (
                        <>
                          <div className='py-2 px-1' style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {
                              notifications.map((notification, index) => {
                                return (
                                  <div key={notification.judul + index}>
                                    {index !== 0 && <DropdownDivider />}
                                    <div className={`rounded-0 w-100 h-100 text-start text-black ${styles.notificationCard}`} style={{ borderTop: "0px", borderRight: "0px", borderBottom: "0px", borderLeft: `4px solid ${borderColor.get(notification.level)}`, position: "relative" }}>
                                      <Stack>
                                        <b className='text-truncate' style={{ maxWidth: "225px" }}>{notification.judul}</b>
                                        <small>{notification.teks}</small>
                                        <small style={{ color: "rgba(0,0,0,0.5)" }}>{formatDaysDeltaToText(calculateDaysDelta(notification.created_at))}</small>
                                      </Stack>
                                      <Button onClick={() => readOneNotification(notification.notif_id)} variant='outline-light' style={{ top: 0, right: 0, position: "absolute", padding: "2px" }}>
                                        <i className={`bi bi-x-lg ${styles.closeBtn}`}></i>
                                      </Button>
                                    </div>
                                  </div>
                                )
                              })
                            }
                          </div>
                          <Button onClick={readAllNotifications} className='rounded-0 w-100 p-0' variant="outline-primary" style={{ border: "0px", marginTop: "8px", boxShadow: "0 -0.5px 4px rgba(0, 0, 0, 0.1)" }}>
                            <div style={{ background: "rgba(0,0,0,0.05)" }} className='p-2'>
                              Tandai sudah baca
                            </div>
                          </Button>
                        </>
                      )
                  }
                </>
              </DropdownMenu>
            </Dropdown>

            <Dropdown className='h-100' align={"end"}>
              <DropdownToggle className='d-flex flex-row align-items-center justify-content-center gap-2 h-100 px-3 py-0 bg-transparent border-0 on-hover rounded-0'>
                <Image alt='profile-picture' width={40} height={40} src={'/images.jpg'} className="rounded-circle" style={{ objectFit: 'cover' }} />
              </DropdownToggle>
              <DropdownMenu style={{ transform: "translateX(-10px)", width: "300px", boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.2)" }} className='bg-white p-0'>
                <div className='d-flex flex-row align-items-center justify-content-center w-100 py-2 mb-2' style={{ boxShadow: "0 0.5px 4px rgba(0, 0, 0, 0.1)" }}>
                  <b>Profile</b>
                </div>
                <div className='p-2'>
                  <div className='d-flex flex-column justify-content-center align-items-start'>
                    <span>{namaKaryawan} | {role.toUpperCase()}</span>
                    <span>PT Perdana Adhi Lestari</span>
                  </div>
                  <DropdownDivider />
                  <div className='d-flex flex-row justify-content-between align-items-center'>
                    <Link href={`/${role}/profile/${karyawanId}`}>
                      <Button type='button' variant='primary'>Profile</Button>
                    </Link>
                    <Button type='button' variant='danger' disabled={loading} onClick={logoutHandler}>
                      <span hidden={!loading} className="spinner-border spinner-border-sm" style={{ marginRight: "4px" }}></span>
                      <span hidden={loading}>Logout</span>
                    </Button>
                  </div>
                </div>
              </DropdownMenu>
            </Dropdown>
          </Stack>
        </Navbar>
      </div>
    </>
  )
}

export default TopBar