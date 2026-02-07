// StatusBadge Component - Display registration status badge

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="mr-1 h-3 w-3" />
          อนุมัติแล้ว
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-500">
          <XCircle className="mr-1 h-3 w-3" />
          ไม่อนุมัติ
        </Badge>
      );
    default:
      return (
        <Badge className="bg-yellow-500">
          <Clock className="mr-1 h-3 w-3" />
          รอการตรวจสอบ
        </Badge>
      );
  }
}
