"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { MONTH_OPTIONS } from "@/app/_constants/mouths";
import { useRouter, useSearchParams } from "next/navigation";

const TimeSelect = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  // const searchParams = new URLSearchParams(window.location.search);
  const month = searchParams.get("month");


  const handleMonthChange = (month: string) => {
    push(`/?month=${month}`)
  }
  return (
    <>
      {/* Selecione o mês */}
      <Select onValueChange={(value) => handleMonthChange(value)} defaultValue={month ?? ''}>
        <SelectTrigger className="w-[150px] rounded-full" >
          <SelectValue placeholder="Selecione um mês" />
        </SelectTrigger>
        <SelectContent>
          {MONTH_OPTIONS.map((option) => (
            <SelectItem key={option.value}
              value={option.value}>{option.label}
            </SelectItem>))}
        </SelectContent>
      </Select>
    </>
  );
}

export default TimeSelect;