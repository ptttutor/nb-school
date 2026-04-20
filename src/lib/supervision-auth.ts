import { cookies } from "next/headers";
import type { SupervisionSession } from "./supervision-utils";

export type { SupervisionSession } from "./supervision-utils";

export async function getSupervisionSession(): Promise<SupervisionSession | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("supervision_session");
    if (!session) return null;
    return JSON.parse(session.value) as SupervisionSession;
  } catch {
    return null;
  }
}

