import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useRef } from "react";
import { useSetRecoilState } from "recoil";
import authState from "src/context/auth";

const LoginPage = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const setAuthState = useSetRecoilState(authState);

  const loginFunc = useCallback(async () => {
    const user = await axios.post("/api/login", {
      pw: inputRef.current.value,
    });

    if (user.data.success) {
      setAuthState(true);
      router.push("/");
    } else alert("비밀번호가 틀렸습니다");
  }, []);

  return (
    <div className="LoginPage">
      <input type="password" ref={inputRef} />
      <button onClick={loginFunc}>로그인</button>
    </div>
  );
};

export default LoginPage;