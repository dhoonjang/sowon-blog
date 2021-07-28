import { atom } from "recoil";

export interface IUserState {
  id: number;
  name: string;
  pw: string;
  bgImageUrl: string | null;
  profileImageUrl: string | null;
}

const userState = atom<IUserState>({
  key: "userState",
  default: {
    id: -1,
    name: "",
    pw: "",
    bgImageUrl: null,
    profileImageUrl: null,
  },
});

export default userState;
