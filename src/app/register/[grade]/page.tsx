"use client";

import { use } from "react";
import { RegistrationForm } from "@/features/registration/components";

export default function RegisterPage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade } = use(params);
  
  return <RegistrationForm grade={grade} />;
}
