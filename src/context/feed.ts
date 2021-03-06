import { DateSummary, PhotoSummary, Post } from "@prisma/client";
import moment from "moment";
import { atom, selector } from "recoil";
import authState from "./auth";

export interface IPhotoSummary
  extends Omit<PhotoSummary, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export interface IPost extends Omit<Post, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export interface IDateSummary
  extends Omit<DateSummary, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export interface IFeedState {
  postList: IPost[];
  dateSummaryList: IDateSummary[];
}

export const postSelector = selector<IPost[]>({
  key: "postSelectorKey",
  get: ({ get }) => {
    const isLogin = get(authState);
    return get(feedState)
      .postList.filter((v) => v.published || isLogin)
      .sort((a, b) => moment(b.createdAt).diff(a.createdAt));
  },
  set: ({ set }, postList: IPost[]) => {
    set(feedState, (f) => ({
      ...f,
      postList,
    }));
  },
});

export const dateSummarySelector = selector<IDateSummary[]>({
  key: "dateSummarySelectorKey",
  get: ({ get }) => get(feedState).dateSummaryList,
  set: ({ set }, dateSummaryList: IDateSummary[]) => {
    set(feedState, (f) => ({
      ...f,
      dateSummaryList,
    }));
  },
});

const feedState = atom<IFeedState>({
  key: "feedStateKey",
  default: {
    postList: [],
    dateSummaryList: [],
  },
});

export default feedState;
