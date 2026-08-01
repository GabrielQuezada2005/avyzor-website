import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { getPortalSessionFromCookies } from "@/lib/portal/session.server";

export default async function PortalProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getPortalSessionFromCookies();

  if (!session) {
    redirect("/portal/login");
  }

  return <PortalShell session={session}>{children}</PortalShell>;
}
