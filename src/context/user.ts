import { atom } from "recoil";

export interface IUserState {
  isLogin: boolean;
  id: number;
  name: string;
  pw: string;
  bgImageUrl: string | null;
  profileImageUrl: string | null;
}

const userState = atom<IUserState>({
  key: "usersState",
  default: {
    isLogin: false,
    id: -1,
    name: "",
    pw: "",
    bgImageUrl: null,
    profileImageUrl: null,
  },
});

export default userState;
