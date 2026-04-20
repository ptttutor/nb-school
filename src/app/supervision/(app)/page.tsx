import { redirect } from "next/navigation";
import { getSupervisionSession } from "@/lib/supervision-auth";

export default async function SupervisionIndexPage() {
  const session = await getSupervisionSession();
  if (!session) {
    redirect("/supervision/login");
  }
  const role = session.role;
  if (role === "TEACHER") redirect("/supervision/teacher");
  if (role === "PRINCIPAL") redirect("/supervision/dashboard");
  if (role === "ACADEMIC_ADMIN") redirect("/supervision/admin");
  redirect("/supervision/review");
}
