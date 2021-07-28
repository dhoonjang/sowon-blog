import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const authState = atom({
  key: "auth_state",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export default authState;
