import { atom } from "recoil";

export interface IUserState {
  id: number;
  name: string;
  pw: string;
  bgImageUrl: string | null;
}

const userState = atom<IUserState>({
  key: "usersState",
  default: {
    id: -1,
    name: "",
    pw: "",
    bgImageUrl: null,
  },
});

export default userState;
