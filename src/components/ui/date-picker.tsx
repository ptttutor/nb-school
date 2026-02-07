"use client";

import * as React from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({ date, setDate, placeholder = "เลือกวันที่" }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date | undefined>(date);

  React.useEffect(() => {
    if (date) {
      setTempDate(date);
    }
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setTempDate(newDate);
  };

  const handleConfirm = () => {
    setDate(tempDate);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempDate(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "d MMMM yyyy", { locale: th })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={tempDate}
          onSelect={handleDateSelect}
          initialFocus
          locale={th}
          captionLayout="dropdown"
          fromYear={1990}
          toYear={new Date().getFullYear() + 5}
          defaultMonth={tempDate || new Date(2010, 0, 1)}
        />
        <div className="p-3 border-t flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            ยกเลิก
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            className="bg-amber-600 hover:bg-amber-700"
          >
            ตกลง
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
