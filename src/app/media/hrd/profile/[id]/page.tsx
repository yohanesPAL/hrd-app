import { ProfileInterface } from "@/types/ProfileType";
import ClientPage from "./clientPage";
import { ServerFetch } from "@/utils/ServerFetch";

export default async function Profile({ params }: { params: { id: string } }) {
  const { id } = await params;

  let data: ProfileInterface | null = null;
  let err: string | null = null
  const res = await ServerFetch({ uri: `/profile/${id}` })

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    err = body?.error ?? "Request failed";
  } else {
    data = await res.json();
  }

  return <ClientPage data={data} err={err} />;
}