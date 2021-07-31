import { DateSummary, Post } from "@prisma/client";
import moment from "moment";
import { atom, selector } from "recoil";
import authState from "./auth";

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

const feedState = atom<IFeedState>({
  key: "feedStateKey",
  default: {
    postList: [],
    dateSummaryList: [],
  },
});

export default feedState;
