import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SideBar from "@/components/Sidebar/Sidebar";
import TopBar from "@/components/TopBar";
import BottomBar from "@/components/BottomBar";
import PageTransition from "./PageTransition";

export default async function HrdLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.role !== "hrd") redirect("/unauthorized");

  return (
    <div className='mx-0 px-0 min-vh-100 w-100 d-flex flex-row'>
      <SideBar role={session.user.role} namaKaryawan={session.user.namaKaryawan}/>
      <div className='d-flex flex-column w-100'>
        <TopBar
          role={session.user.role}
          karyawanId={session.user.karyawanId}
          namaKaryawan={session.user.namaKaryawan}
        />
        <div className='flex-grow-1 d-flex justify-content-center align-items-start w-full'>
          <div className='my-2 p-2' style={{ width: "90%" }}>
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </div>
        <BottomBar />
      </div>
    </div>
  )
}