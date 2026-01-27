import { ProfileInterface } from "@/types/ProfileType";
import ClientPage from "./clientPage";
import { ServerFetch } from "@/utils/ServerFetch";
import DataNotFound from "@/app/not-found/page";
import InternalServerError from "@/app/500/page";

export default async function Profile({ params }: { params: { id: string } }) {
  const { id } = await params;

  const res = await ServerFetch({ uri: `/profile/${id}` })

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const err = body?.error ?? "Request failed";

    if(res.status === 404) return <DataNotFound/>
    return <InternalServerError msg={err}/>
  } 

  const data: ProfileInterface = await res.json();

  return <ClientPage data={data} />;
}