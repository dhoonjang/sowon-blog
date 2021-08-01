import axios from "axios";
import { useCallback, useMemo, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import authState from "src/context/auth";
import feedState, { postSelector } from "src/context/feed";
import Editor, { IEditor } from "../Editor";
import PostComponent from "../PostComponent";
import { EDateObjType, useCalendar } from "./hooks";
import cn from "classnames";
import Router from "next/router";
import { Moment } from "moment";

const Diary: React.FC<{
  selectMoment: Moment | null;
}> = ({ selectMoment }) => {
  const isLogin = useRecoilValue(authState);

  const { table, prevMonth, nextMonth, year, month } =
    useCalendar(selectMoment);

  const tableView = useMemo(
    () =>
      table.map((w, wi) => (
        <div className="week" key={wi}>
          {w.map(({ dayObj, type, select }, i) => (
            <div
              className={cn("day", type, { select })}
              key={`${wi}_${i}`}
              onClick={() => {
                if (type === EDateObjType.next) nextMonth();
                else if (type === EDateObjType.prev) prevMonth();
                Router.push(
                  `/diary/[id]`,
                  `/diary/${dayObj.format("YYYYMMDD")}`
                );
              }}
            >
              {dayObj.format("D")}
            </div>
          ))}
        </div>
      )),
    [table]
  );

  return (
    <div className="Diary">
      <div className="month-button-area">
        <button onClick={prevMonth}>이전 달</button>
        <h3 className="year-month">
          <div className="year">{year} 년</div>
          {month}월
        </h3>
        <button onClick={nextMonth}>다음 달</button>
      </div>
      <div className="date-area">
        <div className="date">일</div>
        <div className="date">월</div>
        <div className="date">화</div>
        <div className="date">수</div>
        <div className="date">목</div>
        <div className="date">금</div>
        <div className="date">토</div>
      </div>
      <div className="table">{tableView}</div>
    </div>
  );
};

export default Diary;
