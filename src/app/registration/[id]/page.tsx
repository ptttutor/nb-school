"use client";

import { use } from "react";
import { RegistrationDetailView } from "@/features/registration-detail";

export default function RegistrationViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  return <RegistrationDetailView id={id} />;
}

