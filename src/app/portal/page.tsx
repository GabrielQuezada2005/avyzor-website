import { redirect } from "next/navigation";
import { getPortalSessionFromCookies } from "@/lib/portal/session.server";

export default async function PortalIndexPage() {
  const session = await getPortalSessionFromCookies();
  redirect(session ? "/portal/dashboard" : "/portal/login");
}
