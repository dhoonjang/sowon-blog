import axios from "axios";
import { useCallback, useRef } from "react";
import { useSetRecoilState } from "recoil";
import authState from "src/context/auth";

const LoginPopUp: React.FC<{ closeFunc: () => void }> = ({ closeFunc }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const setAuthState = useSetRecoilState(authState);

  const loginFunc = useCallback(async () => {
    const user = await axios.post("/api/login", {
      pw: inputRef.current.value,
    });

    if (user.data.success) {
      setAuthState(true);
      closeFunc();
    } else if (user.status === 201) {
      alert("비밀번호가 틀렸습니다");
    }
  }, []);

  return (
    <div className="LoginPage">
      <input type="password" ref={inputRef} />
      <button onClick={loginFunc}>로그인</button>
    </div>
  );
};

export default LoginPopUp;
