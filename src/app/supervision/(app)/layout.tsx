import { redirect } from "next/navigation";
import { getSupervisionSession } from "@/lib/supervision-auth";
import SupervisionSidebar from "@/components/supervision/SupervisionSidebar";

export default async function SupervisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSupervisionSession();
  if (!session) {
    redirect("/supervision/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SupervisionSidebar session={session} />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
