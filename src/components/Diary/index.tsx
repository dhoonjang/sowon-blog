import { useCallback, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import authState from "src/context/auth";
import { EDateObjType, useCalendar } from "./hooks";
import cn from "classnames";
import Router from "next/router";
import moment, { Moment } from "moment";
import Editor, { IEditor } from "../Editor";
import axios from "axios";
import feedState, { dateSummarySelector } from "src/context/feed";
import { useState } from "react";
import { useEffect } from "react";
import produce from "immer";

const Diary: React.FC<{
  selectMoment: Moment | null;
}> = ({ selectMoment }) => {
  const isLogin = useRecoilValue(authState);

  const [dateList, setDateList] = useRecoilState(dateSummarySelector);

  const [toggleCalendar, setToggleCalendar] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);

  const { table, prevMonth, nextMonth, year, month } =
    useCalendar(selectMoment);

  const contentRef = useRef<IEditor>(null);

  const currentDiary = useMemo(() => {
    return dateList.find(
      (d) =>
        moment(d.date).format("YYYYMMDD") === selectMoment.format("YYYYMMDD")
    );
  }, [dateList, selectMoment]);

  const updateDiary = useCallback(async () => {
    if (!contentRef.current) return;

    const diary = await axios.put("/api/diary", {
      id: currentDiary.id,
      content: contentRef.current.value,
    });

    setDateList((posts) => {
      return produce(posts, (draft) => {
        const index = draft.findIndex((f) => f.id === diary.data.id);
        draft.splice(index, 1, diary.data);
      });
    });

    contentRef.current.setValue("");
    setEditMode(false);
  }, [currentDiary, selectMoment]);

  const submitDiary = useCallback(async () => {
    if (!contentRef.current) return;

    const res = await axios.post("/api/diary", {
      date: selectMoment.toString(),
      content: contentRef.current.value,
    });

    if (res.status === 200) {
      setDateList((dl) => [...dl, res.data]);
      contentRef.current.setValue("");
    }
  }, [selectMoment]);

  const deleteDiary = useCallback(async () => {
    if (!currentDiary) return;
    const res = await axios.delete("/api/diary", {
      params: { id: currentDiary.id },
    });
    if (res.status === 200) {
      setDateList((dates) => {
        return produce(dates, (draft) => {
          const index = draft.findIndex((f) => f.id === res.data.id);
          draft.splice(index, 1);
        });
      });
    }
  }, [currentDiary]);

  const tableView = useMemo(
    () =>
      table.map((w, wi) => (
        <div className="week" key={wi}>
          {w.map(({ dayObj, type, select }, i) => {
            const isDiary =
              dateList.findIndex(
                (d) =>
                  moment(d.date).format("YYYYMMDD") ===
                  dayObj.format("YYYYMMDD")
              ) >= 0;
            return (
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
                {isDiary && <div className="dot" />}
              </div>
            );
          })}
        </div>
      )),
    [table, dateList]
  );

  useEffect(() => {
    if (editMode && currentDiary) {
      contentRef.current.setValue(currentDiary.content);
    }
  }, [editMode]);

  useEffect(() => {
    if (!isLogin) Router.push("/");
  }, [isLogin]);

  return (
    <div className="Diary">
      {!toggleCalendar ? (
        <button onClick={() => setToggleCalendar(true)}>?????? ??????</button>
      ) : (
        <div className="calendar">
          <button onClick={() => setToggleCalendar(false)}>?????? ??????</button>
          <div className="month-button-area">
            <button onClick={prevMonth}>?????? ???</button>
            <h3 className="year-month">
              <div className="year">{year} ???</div>
              {month}???
            </h3>
            <button onClick={nextMonth}>?????? ???</button>
          </div>
          <div className="date-area">
            <div className="date">???</div>
            <div className="date">???</div>
            <div className="date">???</div>
            <div className="date">???</div>
            <div className="date">???</div>
            <div className="date">???</div>
            <div className="date">???</div>
          </div>
          <div className="table">{tableView}</div>
        </div>
      )}
      {currentDiary ? (
        editMode ? (
          <div className="editor-area">
            <button onClick={updateDiary}>?????? ??????</button>
            <Editor className="editor" ref={contentRef} />
          </div>
        ) : (
          <div className="diary-area">
            <button onClick={() => setEditMode(true)}>??????</button>
            <button onClick={deleteDiary}>??????</button>
            <div
              className="ql-editor content-inner"
              dangerouslySetInnerHTML={{ __html: currentDiary.content }}
            />
          </div>
        )
      ) : (
        <>
          <div className="diary-area">
            <h3 className="none-message">
              {selectMoment.format("YYYY??? M??? D?????? ????????? ????????????")}
            </h3>
          </div>
          <div className="editor-area">
            <button onClick={submitDiary}>?????? ??????</button>
            <Editor className="editor" ref={contentRef} />
          </div>
        </>
      )}
    </div>
  );
};

export default Diary;
