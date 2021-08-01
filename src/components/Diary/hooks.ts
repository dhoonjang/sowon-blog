import moment, { Moment } from "moment";
import { useCallback, useMemo, useState } from "react";

export enum EDateObjType {
  prev = "prev",
  today = "today",
  current = "current",
  next = "next",
}

export interface ICalendarDate {
  type: EDateObjType;
  select: boolean;
  dayObj: Moment;
}

export const useCalendar = (selectMoment: Moment | undefined) => {
  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState(moment().month());

  const table = useMemo(() => {
    const table: ICalendarDate[][] = [[]];

    const lastDate = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDay();

    let weekIndex = 0;
    let dayObj = moment([year, month, 1]).subtract(startDay, "day");

    let prevDay = 0;

    while (prevDay < startDay) {
      table[weekIndex].push({
        type: EDateObjType.prev,
        select: false,
        dayObj: moment(dayObj),
      });

      dayObj = dayObj.add(1, "day");
      prevDay++;
    }

    for (let i = 0; i < lastDate; i++) {
      const isToday = moment().format("YYYYMMDD") === dayObj.format("YYYYMMDD");
      const select = selectMoment
        ? selectMoment.format("YYYYMMDD") === dayObj.format("YYYYMMDD")
        : false;

      table[weekIndex].push({
        type: isToday ? EDateObjType.today : EDateObjType.current,
        select,
        dayObj: moment(dayObj),
      });

      dayObj = dayObj.add(1, "day");

      if (table[weekIndex].length === 7) {
        table.push([]);
        weekIndex++;
      }
    }

    let nextDay = lastDay + 1;

    while (nextDay < 7) {
      table[weekIndex].push({
        type: EDateObjType.next,
        select: false,
        dayObj: moment(dayObj),
      });
      dayObj = dayObj.add(1, "day");
      nextDay = nextDay + 1;
    }

    return table;
  }, [year, month, selectMoment]);

  const prevMonth = useCallback(() => {
    if (month >= 1) {
      setMonth(month - 1);
    } else {
      setYear(year - 1);
      setMonth(11);
    }
  }, [year, month]);

  const nextMonth = useCallback(() => {
    if (month < 11) {
      setMonth(month + 1);
    } else {
      setYear(year + 1);
      setMonth(0);
    }
  }, [year, month]);

  return { year, month: month + 1, table, prevMonth, nextMonth };
};
