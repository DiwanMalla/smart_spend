import { useState, useEffect } from "react";
import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Period, TimeFrame } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: TimeFrame;
  setTimeframe: (timeframe: TimeFrame) => void;
}

const HistoryPeriodSelector = ({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: Props) => {
  const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: () => fetch(`/api/history-periods`).then((res) => res.json()),
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure this code runs only on the client
    setIsClient(true);
  }, []);

  if (!isClient || historyPeriods.isLoading) return null; // Prevent rendering before client-side hydration and while loading

  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as TimeFrame)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper
          isLoading={historyPeriods.isFetching}
          fullWidth={false}
        >
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods.data || []}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper
            isLoading={historyPeriods.isFetching}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
};

export default HistoryPeriodSelector;

const YearSelector = ({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryPeriodsResponseType;
}) => (
  <Select
    value={period.year.toString()}
    onValueChange={(value) => {
      setPeriod({ month: period.month, year: parseInt(value) });
    }}
  >
    <SelectTrigger className="w-[180px]">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {years && years.length > 0 ? (
        years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))
      ) : (
        <SelectItem disabled value={""}>
          No years available
        </SelectItem>
      )}
    </SelectContent>
  </Select>
);

const MonthSelector = ({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) => (
  <Select
    value={period.month.toString()}
    onValueChange={(value) => {
      setPeriod({ year: period.year, month: parseInt(value) });
    }}
  >
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select a month" />
    </SelectTrigger>
    <SelectContent>
      {Array.from({ length: 12 }, (_, i) => i).map((month) => {
        // Correct the month indexing by adding 1 to the month value
        const monthStr = new Date(period.year, month).toLocaleString(
          "default",
          {
            month: "long",
          }
        );
        return (
          <SelectItem key={month} value={month.toString()}>
            {monthStr}
          </SelectItem>
        );
      })}
    </SelectContent>
  </Select>
);
